import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import {
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAnalysis, useEntries, useToast } from '../../hooks';
import { AnalysisResult } from '../../models';
import { APP_CONFIG } from '../../config/app.config';
import Toast from '../../components/common/Toast';
import { AnimatedBot } from '../../components/animations';
import GradientBackground from '../../components/common/GradientBackground';
import UserMessage from '../../components/common/UserMessage';
import AnalysisMessage from '../../components/common/AnalysisMessage';
import { GRADIENT_COLORS, THEME_COLORS } from '../../constants';

const { width } = Dimensions.get('window');

interface ChatMessage {
  id: string;
  type: 'user' | 'analysis' | 'analyzing';
  text?: string;
  analysis?: AnalysisResult;
  timestamp: number;
}

const HomeScreen = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMood, setCurrentMood] = useState<'positive' | 'negative' | 'neutral' | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const { analyze, loading, error } = useAnalysis();
  const { saveEntry } = useEntries();
  const { toast, hideToast, showSuccess, showError, showWarning } = useToast();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleAnalyze = useCallback(async () => {
    if (text.trim().length < APP_CONFIG.MIN_ENTRY_LENGTH) {
      showError(`Please enter at least ${APP_CONFIG.MIN_ENTRY_LENGTH} characters.`);
      return;
    }

    const userMessageId = Date.now().toString();
    const analyzingMessageId = (Date.now() + 1).toString();

    // Add user message
    const userMessage: ChatMessage = {
      id: userMessageId,
      type: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    // Add analyzing placeholder
    const analyzingMessage: ChatMessage = {
      id: analyzingMessageId,
      type: 'analyzing',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage, analyzingMessage]);
    const userText = text.trim();
    setText('');

    // Perform analysis
    const result = await analyze(userText);

    if (result) {
      // Update mood
      setCurrentMood(result.sentiment.type);

      // Replace analyzing message with actual analysis
      setMessages(prev =>
        prev.map(msg =>
          msg.id === analyzingMessageId
            ? { ...msg, type: 'analysis' as const, analysis: result }
            : msg
        )
      );

      // Save entry
      const entry = {
        id: userMessageId,
        text: userText,
        analysis: result,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      try {
        await saveEntry(entry);
      } catch (err) {
        console.error('Error saving entry:', err);
      }

      if (result.summary.includes('Offline') || result.summary.includes('offline')) {
        showWarning('Analysis completed in offline mode.');
      }
    } else {
      // Remove analyzing message if analysis failed
      setMessages(prev => prev.filter(msg => msg.id !== analyzingMessageId));

      if (error) {
        showError(error);
      }
    }
  }, [text, analyze, error, showError, showWarning, saveEntry]);

  const isValidInput = useMemo(
    () => text.trim().length >= APP_CONFIG.MIN_ENTRY_LENGTH,
    [text],
  );

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.type === 'user') {
      return <UserMessage text={item.text!} timestamp={item.timestamp} />;
    }

    if (item.type === 'analyzing') {
      return <AnalysisMessage isAnalyzing={true} />;
    }

    if (item.type === 'analysis') {
      return <AnalysisMessage analysis={item.analysis} />;
    }

    return null;
  };

  const isLandingState = messages.length === 0;

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setCurrentMood(null);
    setText('');
  }, []);

  return (
    <View style={styles.container}>
      <GradientBackground
        colors={GRADIENT_COLORS.primary}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <Toast
            visible={toast.visible}
            message={toast.message}
            type={toast.type}
            onDismiss={hideToast}
          />

          {isLandingState ? (
            /* Landing State - Large Orb Centered */
            <>
              <View style={styles.landingContainer}>
                <Text style={styles.landingGreeting}>Hello,</Text>
                <Text style={styles.landingSubtitle}>Let's check in with your mood.</Text>

                <View style={styles.landingOrbContainer}>
                  <AnimatedBot size={width * 0.58} sentiment={currentMood} />
                </View>

                <View style={styles.landingInputCard}>
                  <RNTextInput
                    placeholder="Describe how you're feeling right now..."
                    placeholderTextColor={THEME_COLORS.textSecondary}
                    value={text}
                    onChangeText={setText}
                    multiline
                    maxLength={APP_CONFIG.MAX_ENTRY_LENGTH}
                    style={styles.landingInput}
                    editable={!loading}
                    textAlignVertical="top"
                  />
                  <View style={styles.landingFooter}>
                    <Text style={styles.landingHintText}>
                      Your entry will be analyzed to detect sentiment.
                    </Text>
                    <TouchableOpacity
                      onPress={handleAnalyze}
                      disabled={loading || !isValidInput}
                      style={[
                        styles.landingSendButton,
                        (!isValidInput || loading) && styles.sendButtonDisabled,
                      ]}
                      activeOpacity={0.7}
                    >
                      {loading ? (
                        <ActivityIndicator color={THEME_COLORS.textLight} size="small" />
                      ) : (
                        <Icon name="send" size={20} color={THEME_COLORS.textLight} />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </>
          ) : (
            /* Chat Mode - Small Orb in Header */
            <>
              {/* Header with Small Orb */}
              <View style={styles.chatHeader}>
                <View style={styles.chatHeaderOrb}>
                  <AnimatedBot size={74} sentiment={currentMood} faceScale={0.5} />
                </View>
                <View style={styles.chatHeaderText}>
                  <Text style={styles.chatGreeting}>Hello,</Text>
                  <Text style={styles.chatSubtitle}>Let's check in with your mood.</Text>
                </View>
                <TouchableOpacity
                  onPress={handleNewChat}
                  style={styles.newChatButton}
                  activeOpacity={0.7}
                >
                  <Icon name="plus-circle" size={28} color={THEME_COLORS.primary} />
                </TouchableOpacity>
              </View>

              {/* Chat Messages */}
              <View style={styles.chatMessagesContainer}>
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  renderItem={renderMessage}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.chatContent}
                  showsVerticalScrollIndicator={false}
                />
              </View>

              {/* Bottom Input Bar */}
              <View style={styles.chatInputContainer}>
                <View style={styles.inputWrapper}>
                  <RNTextInput
                    placeholder="Describe how you're feeling..."
                    placeholderTextColor={THEME_COLORS.textSecondary}
                    value={text}
                    onChangeText={setText}
                    multiline
                    maxLength={APP_CONFIG.MAX_ENTRY_LENGTH}
                    style={styles.input}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={handleAnalyze}
                    disabled={loading || !isValidInput}
                    style={[
                      styles.sendButton,
                      (!isValidInput || loading) && styles.sendButtonDisabled,
                    ]}
                    activeOpacity={0.7}
                  >
                    {loading ? (
                      <ActivityIndicator color={THEME_COLORS.textLight} size="small" />
                    ) : (
                      <Icon name="send" size={20} color={THEME_COLORS.textLight} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </GradientBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },

  // Landing State Styles
  landingContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  landingOrbContainer: {
    marginVertical: 32,
    alignSelf: 'center',
  },
  landingGreeting: {
    fontSize: 32,
    color: THEME_COLORS.primary,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  landingSubtitle: {
    fontSize: 18,
    color: THEME_COLORS.primary,
    fontWeight: '500',
    letterSpacing: -0.2,
    lineHeight: 24,
    opacity: 0.8,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  landingInputCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  landingInput: {
    fontSize: 16,
    color: THEME_COLORS.text,
    minHeight: 100,
    maxHeight: 150,
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 12,
    paddingTop: 0,
  },
  landingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  landingHintText: {
    flex: 1,
    fontSize: 12,
    color: THEME_COLORS.textSecondary,
    opacity: 0.6,
    fontWeight: '400',
  },
  landingSendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: THEME_COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },

  // Chat Mode Styles
  chatHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  chatHeaderOrb: {
    marginRight: 12,
  },
  chatHeaderText: {
    flex: 1,
  },
  chatGreeting: {
    fontSize: 20,
    color: THEME_COLORS.primary,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  chatSubtitle: {
    fontSize: 13,
    color: THEME_COLORS.primary,
    fontWeight: '500',
    letterSpacing: -0.1,
    lineHeight: 18,
    opacity: 0.7,
  },
  newChatButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowColor: THEME_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  chatMessagesContainer: {
    flex: 1,
  },
  chatContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  chatInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 80 : 70,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(139, 92, 246, 0.1)',
  },

  // Shared Input Styles
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: THEME_COLORS.text,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
    fontWeight: '400',
    lineHeight: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: THEME_COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButtonDisabled: {
    backgroundColor: THEME_COLORS.textSecondary,
    shadowOpacity: 0.1,
    opacity: 0.5,
  },
});

export default HomeScreen;