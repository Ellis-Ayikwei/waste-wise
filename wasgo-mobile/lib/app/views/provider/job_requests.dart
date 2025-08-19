import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/core/widgets/app_button.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/controllers/provider_controller.dart';
import 'package:redux/redux.dart';

class JobRequestsView extends StatefulWidget {
  const JobRequestsView({Key? key}) : super(key: key);

  @override
  State<JobRequestsView> createState() => _JobRequestsViewState();
}

class _JobRequestsViewState extends State<JobRequestsView> {
  String _filterStatus = 'All';
  
  @override
  void initState() {
    super.initState();
    // Fetch job requests when page loads
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final store = StoreProvider.of<AppState>(context);
      ProviderController(store).fetchJobRequests();
    });
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _ViewModel>(
      converter: (store) => _ViewModel(
        state: store.state,
        controller: ProviderController(store),
      ),
      builder: (context, vm) {
        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: AppBar(
            title: const Text('Job Requests'),
            backgroundColor: AppColors.primary,
            elevation: 0,
            actions: [
              IconButton(
                icon: const Icon(Icons.filter_list),
                onPressed: _showFilterOptions,
              ),
            ],
          ),
          body: RefreshIndicator(
            onRefresh: () async {
              vm.controller.fetchJobRequests();
            },
            child: vm.state.providerState.isLoading
                ? const Center(child: CircularProgressIndicator())
                : vm.state.providerState.jobRequests.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: vm.state.providerState.jobRequests.length,
                        itemBuilder: (context, index) {
                          final job = vm.state.providerState.jobRequests[index];
                          return _buildJobCard(job, vm);
                        },
                      ),
          ),
        );
      },
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.work_off,
            size: 80,
            color: Colors.grey.shade400,
          ),
          const SizedBox(height: 16),
          Text(
            'No job requests available',
            style: TextStyle(
              fontSize: 18,
              color: Colors.grey.shade600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Pull down to refresh',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildJobCard(Map<String, dynamic> job, _ViewModel vm) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Job #${job['id'] ?? '000'}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                _buildUrgencyBadge(job['urgency'] ?? 'Regular'),
              ],
            ),
            const SizedBox(height: 12),
            _buildInfoRow(Icons.delete, job['waste_type'] ?? 'General Waste'),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.location_on, job['address'] ?? 'No address'),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.calendar_today, 
              job['scheduled_date'] ?? 'Immediate pickup'),
            const SizedBox(height: 8),
            _buildInfoRow(Icons.scale, '${job['quantity'] ?? '0'} kg'),
            if (job['description'] != null && job['description'].isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                job['description'],
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey.shade600,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    text: 'Reject',
                    onPressed: () => _rejectJob(job['id'], vm),
                    backgroundColor: Colors.red,
                    height: 40,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: AppButton(
                    text: 'Accept',
                    onPressed: () => _acceptJob(job['id'], vm),
                    height: 40,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 18, color: Colors.grey.shade600),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey.shade700,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUrgencyBadge(String urgency) {
    Color color;
    switch (urgency.toLowerCase()) {
      case 'urgent':
        color = Colors.red;
        break;
      case 'scheduled':
        color = Colors.blue;
        break;
      default:
        color = Colors.green;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color),
      ),
      child: Text(
        urgency,
        style: TextStyle(
          fontSize: 12,
          color: color,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  void _showFilterOptions() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Filter Jobs',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              _buildFilterOption('All', Icons.all_inclusive),
              _buildFilterOption('Urgent', Icons.priority_high),
              _buildFilterOption('Scheduled', Icons.schedule),
              _buildFilterOption('Regular', Icons.check_circle),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFilterOption(String label, IconData icon) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      selected: _filterStatus == label,
      onTap: () {
        setState(() {
          _filterStatus = label;
        });
        Get.back();
      },
    );
  }

  void _acceptJob(String jobId, _ViewModel vm) {
    Get.dialog(
      AlertDialog(
        title: const Text('Accept Job'),
        content: const Text('Are you sure you want to accept this job?'),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              vm.controller.acceptJob(jobId);
              Get.back();
              Get.snackbar(
                'Success',
                'Job accepted successfully',
                backgroundColor: Colors.green,
                colorText: Colors.white,
              );
            },
            child: const Text('Accept'),
          ),
        ],
      ),
    );
  }

  void _rejectJob(String jobId, _ViewModel vm) {
    Get.dialog(
      AlertDialog(
        title: const Text('Reject Job'),
        content: const Text('Are you sure you want to reject this job?'),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              vm.controller.rejectJob(jobId);
              Get.back();
              Get.snackbar(
                'Info',
                'Job rejected',
                backgroundColor: Colors.orange,
                colorText: Colors.white,
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: const Text('Reject'),
          ),
        ],
      ),
    );
  }
}

class _ViewModel {
  final AppState state;
  final ProviderController controller;

  _ViewModel({
    required this.state,
    required this.controller,
  });
}