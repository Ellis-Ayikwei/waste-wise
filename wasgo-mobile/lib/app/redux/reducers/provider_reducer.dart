import 'package:bytedev/app/redux/actions/provider_actions.dart';
import 'package:bytedev/app/redux/states/provider_state.dart';

ProviderState providerReducer(ProviderState state, dynamic action) {
  if (action is ProviderLoadingAction) {
    return state.copyWith(isLoading: action.isLoading);
  } else if (action is ProviderErrorAction) {
    return state.copyWith(error: action.error, isLoading: false);
  } else if (action is UpdateJobRequestsAction) {
    return state.copyWith(jobRequests: action.jobRequests, isLoading: false);
  } else if (action is UpdateActiveJobsAction) {
    return state.copyWith(activeJobs: action.activeJobs, isLoading: false);
  } else if (action is UpdateFleetAction) {
    return state.copyWith(fleet: action.fleet, isLoading: false);
  } else if (action is UpdateDriversAction) {
    return state.copyWith(drivers: action.drivers, isLoading: false);
  } else if (action is UpdateEarningsAction) {
    return state.copyWith(earnings: action.earnings, isLoading: false);
  } else if (action is UpdateAnalyticsAction) {
    return state.copyWith(analytics: action.analytics, isLoading: false);
  } else if (action is ProviderSuccessAction) {
    // Handle specific success actions based on actionType
    switch (action.actionType) {
      case 'job_accepted':
        // Move job from requests to active
        final acceptedJob = state.jobRequests.firstWhere(
          (job) => job['id'] == action.data,
          orElse: () => null,
        );
        if (acceptedJob != null) {
          final updatedRequests = List.from(state.jobRequests)
            ..removeWhere((job) => job['id'] == action.data);
          final updatedActive = List.from(state.activeJobs)..add(acceptedJob);
          return state.copyWith(
            jobRequests: updatedRequests,
            activeJobs: updatedActive,
            currentJob: acceptedJob,
            isLoading: false,
          );
        }
        break;
      case 'job_completed':
        // Move job from active to completed
        final completedJob = state.activeJobs.firstWhere(
          (job) => job['id'] == action.data['jobId'],
          orElse: () => null,
        );
        if (completedJob != null) {
          final updatedActive = List.from(state.activeJobs)
            ..removeWhere((job) => job['id'] == action.data['jobId']);
          final updatedCompleted = List.from(state.completedJobs)
            ..add(completedJob);
          return state.copyWith(
            activeJobs: updatedActive,
            completedJobs: updatedCompleted,
            isLoading: false,
          );
        }
        break;
      case 'vehicle_added':
        final updatedFleet = List.from(state.fleet)
          ..add(action.data);
        return state.copyWith(fleet: updatedFleet, isLoading: false);
      case 'driver_added':
        final updatedDrivers = List.from(state.drivers)
          ..add(action.data);
        return state.copyWith(drivers: updatedDrivers, isLoading: false);
      default:
        return state.copyWith(isLoading: false);
    }
  }
  return state;
}