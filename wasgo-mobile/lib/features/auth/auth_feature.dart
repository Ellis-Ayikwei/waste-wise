import 'package:bytedev/app/controllers/auth_controller.dart';
import 'package:bytedev/app/models/auth_model.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:redux/redux.dart';

class AuthFeature {
  final AuthController controller;
  final AuthModel model;

  AuthFeature(Store<AppState> store)
      : controller = AuthController(store),
        model = AuthModel();
}
