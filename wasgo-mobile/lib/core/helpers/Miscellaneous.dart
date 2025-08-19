 import 'package:bytedev/app/redux/middlewares/auth_middleware.dart';
import 'package:bytedev/app/redux/reducers/app_reducer.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/redux/states/auth_state.dart';
import 'package:bytedev/services/auth_service.dart';
import 'package:redux/redux.dart';

final Store<AppState> store = Store<AppState>(
    appReducer,
    initialState: AppState(authState: AuthState()),
    middleware: [AuthMiddleware(AuthService()).call],
  );