import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineSmall" style={styles.title}>
                ⚠️ Bir Hata Oluştu
              </Text>
              <Text variant="bodyMedium" style={styles.message}>
                Uygulamada beklenmeyen bir hata oluştu. Lütfen uygulamayı yeniden başlatın.
              </Text>
              {__DEV__ && this.state.error && (
                <Text variant="bodySmall" style={styles.errorDetails}>
                  {this.state.error.toString()}
                </Text>
              )}
              <Button
                mode="contained"
                onPress={this.handleReset}
                style={styles.button}
              >
                Tekrar Dene
              </Button>
            </Card.Content>
          </Card>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  card: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#F44336',
  },
  message: {
    marginBottom: 16,
    textAlign: 'center',
  },
  errorDetails: {
    marginTop: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  button: {
    marginTop: 8,
  },
});

export default ErrorBoundary;

