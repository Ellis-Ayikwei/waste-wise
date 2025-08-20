abstract class ProviderAction {}

// Job Actions
class FetchJobRequestsAction extends ProviderAction {}

class AcceptJobAction extends ProviderAction {
  final String jobId;
  AcceptJobAction(this.jobId);
}

class RejectJobAction extends ProviderAction {
  final String jobId;
  RejectJobAction(this.jobId);
}

class FetchActiveJobsAction extends ProviderAction {}

class CompleteJobAction extends ProviderAction {
  final String jobId;
  final Map<String, dynamic> completionData;
  CompleteJobAction(this.jobId, this.completionData);
}

class UpdateJobStatusAction extends ProviderAction {
  final String jobId;
  final String status;
  UpdateJobStatusAction(this.jobId, this.status);
}

// Fleet Management Actions
class FetchFleetAction extends ProviderAction {}

class AddVehicleAction extends ProviderAction {
  final Map<String, dynamic> vehicleData;
  AddVehicleAction(this.vehicleData);
}

class UpdateVehicleAction extends ProviderAction {
  final String vehicleId;
  final Map<String, dynamic> vehicleData;
  UpdateVehicleAction(this.vehicleId, this.vehicleData);
}

class RemoveVehicleAction extends ProviderAction {
  final String vehicleId;
  RemoveVehicleAction(this.vehicleId);
}

// Driver Management Actions
class FetchDriversAction extends ProviderAction {}

class AddDriverAction extends ProviderAction {
  final Map<String, dynamic> driverData;
  AddDriverAction(this.driverData);
}

class UpdateDriverAction extends ProviderAction {
  final String driverId;
  final Map<String, dynamic> driverData;
  UpdateDriverAction(this.driverId, this.driverData);
}

class RemoveDriverAction extends ProviderAction {
  final String driverId;
  RemoveDriverAction(this.driverId);
}

// Earnings Actions
class FetchEarningsAction extends ProviderAction {
  final String? period;
  FetchEarningsAction({this.period});
}

class WithdrawEarningsAction extends ProviderAction {
  final double amount;
  WithdrawEarningsAction(this.amount);
}

// Analytics Actions
class FetchAnalyticsAction extends ProviderAction {
  final String? period;
  FetchAnalyticsAction({this.period});
}

// Success Actions
class ProviderLoadingAction extends ProviderAction {
  final bool isLoading;
  ProviderLoadingAction(this.isLoading);
}

class ProviderSuccessAction extends ProviderAction {
  final String actionType;
  final dynamic data;
  ProviderSuccessAction(this.actionType, this.data);
}

class ProviderErrorAction extends ProviderAction {
  final String error;
  ProviderErrorAction(this.error);
}

class UpdateJobRequestsAction extends ProviderAction {
  final List<dynamic> jobRequests;
  UpdateJobRequestsAction(this.jobRequests);
}

class UpdateActiveJobsAction extends ProviderAction {
  final List<dynamic> activeJobs;
  UpdateActiveJobsAction(this.activeJobs);
}

class UpdateFleetAction extends ProviderAction {
  final List<dynamic> fleet;
  UpdateFleetAction(this.fleet);
}

class UpdateDriversAction extends ProviderAction {
  final List<dynamic> drivers;
  UpdateDriversAction(this.drivers);
}

class UpdateEarningsAction extends ProviderAction {
  final Map<String, dynamic> earnings;
  UpdateEarningsAction(this.earnings);
}

class UpdateAnalyticsAction extends ProviderAction {
  final Map<String, dynamic> analytics;
  UpdateAnalyticsAction(this.analytics);
}