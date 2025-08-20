import 'package:bytedev/app/redux/actions/provider_actions.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:redux/redux.dart';

class ProviderController {
  final Store<AppState> _store;

  ProviderController(this._store);

  // Job Management
  void fetchJobRequests() {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(FetchJobRequestsAction());
  }

  void acceptJob(String jobId) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(AcceptJobAction(jobId));
  }

  void rejectJob(String jobId) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(RejectJobAction(jobId));
  }

  void fetchActiveJobs() {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(FetchActiveJobsAction());
  }

  void completeJob(String jobId, Map<String, dynamic> completionData) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(CompleteJobAction(jobId, completionData));
  }

  void updateJobStatus(String jobId, String status) {
    _store.dispatch(UpdateJobStatusAction(jobId, status));
  }

  // Fleet Management
  void fetchFleet() {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(FetchFleetAction());
  }

  void addVehicle(Map<String, dynamic> vehicleData) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(AddVehicleAction(vehicleData));
  }

  void updateVehicle(String vehicleId, Map<String, dynamic> vehicleData) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(UpdateVehicleAction(vehicleId, vehicleData));
  }

  void removeVehicle(String vehicleId) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(RemoveVehicleAction(vehicleId));
  }

  // Driver Management
  void fetchDrivers() {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(FetchDriversAction());
  }

  void addDriver(Map<String, dynamic> driverData) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(AddDriverAction(driverData));
  }

  void updateDriver(String driverId, Map<String, dynamic> driverData) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(UpdateDriverAction(driverId, driverData));
  }

  void removeDriver(String driverId) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(RemoveDriverAction(driverId));
  }

  // Earnings Management
  void fetchEarnings({String? period}) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(FetchEarningsAction(period: period));
  }

  void withdrawEarnings(double amount) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(WithdrawEarningsAction(amount));
  }

  // Analytics
  void fetchAnalytics({String? period}) {
    _store.dispatch(ProviderLoadingAction(true));
    _store.dispatch(FetchAnalyticsAction(period: period));
  }
}