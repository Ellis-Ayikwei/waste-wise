import 'package:bytedev/app/redux/reducers/auth_reducer.dart';
import 'package:bytedev/app/redux/reducers/profile_reducer.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:redux/redux.dart';

AppState appReducer(AppState state, dynamic action) {
  return AppState(
    authState: authReducer(state.authState, action),
    profileState: profileReducer(state.profileState, action),
  );
}

final Reducer<AppState> rootReducer = combineReducers<AppState>([
  TypedReducer<AppState, dynamic>((state, action) => appReducer(state, action)).call,
]);
