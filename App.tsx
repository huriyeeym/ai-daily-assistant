import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ReduxProvider store={store}>
          <SafeAreaProvider>
            <PaperProvider>
              <StatusBar barStyle="light-content" backgroundColor="#667eea" />
              <RootNavigator />
            </PaperProvider>
          </SafeAreaProvider>
        </ReduxProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default App;
