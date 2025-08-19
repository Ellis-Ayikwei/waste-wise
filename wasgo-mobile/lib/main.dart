import 'package:bytedev/app/redux/reducers/app_reducer.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:redux/redux.dart';

import 'src/app.dart';

Future<void> main() async {
  final store = Store<AppState>(
    appReducer,
    initialState: AppState(
      authState: AuthState.initialState,
    ),
  );

  // Run the app and pass in the store
  runApp(
    StoreProvider<AppState>(
      store: store,
      child: MyApp(
        initialRoute: '/onboarding',
      ),
    ),
  );
}
