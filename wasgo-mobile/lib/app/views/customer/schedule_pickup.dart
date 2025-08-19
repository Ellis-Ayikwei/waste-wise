import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:bytedev/core/theme/app_colors.dart';
import 'package:bytedev/core/widgets/app_button.dart';
import 'package:bytedev/core/widgets/app_text_field.dart';
import 'package:flutter_redux/flutter_redux.dart';
import 'package:bytedev/app/redux/states/app_state.dart';
import 'package:bytedev/app/controllers/customer_controller.dart';
import 'package:redux/redux.dart';

class SchedulePickupView extends StatefulWidget {
  const SchedulePickupView({Key? key}) : super(key: key);

  @override
  State<SchedulePickupView> createState() => _SchedulePickupViewState();
}

class _SchedulePickupViewState extends State<SchedulePickupView> {
  final _formKey = GlobalKey<FormState>();
  final _addressController = TextEditingController();
  final _descriptionController = TextEditingController();
  
  String _selectedWasteType = 'General';
  String _selectedFrequency = 'Weekly';
  List<String> _selectedDays = [];
  TimeOfDay _selectedTime = TimeOfDay(hour: 9, minute: 0);

  final List<String> _wasteTypes = [
    'General',
    'Recyclable',
    'Organic',
    'Mixed',
  ];

  final List<String> _frequencies = [
    'Daily',
    'Weekly',
    'Bi-Weekly',
    'Monthly',
  ];

  final List<String> _weekDays = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];

  @override
  void dispose() {
    _addressController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return StoreConnector<AppState, _ViewModel>(
      converter: (store) => _ViewModel(
        state: store.state,
        controller: CustomerController(store),
      ),
      builder: (context, vm) {
        return Scaffold(
          backgroundColor: AppColors.background,
          appBar: AppBar(
            title: const Text('Schedule Pickup'),
            backgroundColor: AppColors.primary,
            elevation: 0,
          ),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionTitle('Schedule Details'),
                  const SizedBox(height: 16),
                  _buildFrequencySelector(),
                  const SizedBox(height: 16),
                  if (_selectedFrequency == 'Weekly' || _selectedFrequency == 'Bi-Weekly')
                    _buildDaySelector(),
                  const SizedBox(height: 16),
                  _buildTimePicker(),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Waste Information'),
                  const SizedBox(height: 16),
                  _buildWasteTypeSelector(),
                  const SizedBox(height: 16),
                  AppTextField(
                    controller: _descriptionController,
                    hintText: 'Additional notes (optional)',
                    maxLines: 3,
                  ),
                  const SizedBox(height: 24),
                  _buildSectionTitle('Pickup Location'),
                  const SizedBox(height: 16),
                  AppTextField(
                    controller: _addressController,
                    hintText: 'Pickup address',
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter pickup address';
                      }
                      return null;
                    },
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.my_location),
                      onPressed: _getCurrentLocation,
                    ),
                  ),
                  const SizedBox(height: 32),
                  AppButton(
                    text: 'Create Schedule',
                    onPressed: vm.state.customerState.isLoading
                        ? null
                        : () => _submitSchedule(vm),
                    isLoading: vm.state.customerState.isLoading,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildFrequencySelector() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedFrequency,
          isExpanded: true,
          onChanged: (String? newValue) {
            setState(() {
              _selectedFrequency = newValue!;
              _selectedDays.clear();
            });
          },
          items: _frequencies.map<DropdownMenuItem<String>>((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildDaySelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Select Days',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          children: _weekDays.map((day) {
            final isSelected = _selectedDays.contains(day);
            return FilterChip(
              label: Text(day),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  if (selected) {
                    _selectedDays.add(day);
                  } else {
                    _selectedDays.remove(day);
                  }
                });
              },
              selectedColor: AppColors.primary,
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : Colors.black,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildTimePicker() {
    return InkWell(
      onTap: _selectTime,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Row(
          children: [
            const Icon(Icons.access_time, size: 20),
            const SizedBox(width: 8),
            Text('Preferred Time: ${_selectedTime.format(context)}'),
            const Spacer(),
            const Icon(Icons.arrow_drop_down),
          ],
        ),
      ),
    );
  }

  Widget _buildWasteTypeSelector() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        border: Border.all(color: Colors.grey.shade300),
        borderRadius: BorderRadius.circular(8),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: _selectedWasteType,
          isExpanded: true,
          onChanged: (String? newValue) {
            setState(() {
              _selectedWasteType = newValue!;
            });
          },
          items: _wasteTypes.map<DropdownMenuItem<String>>((String value) {
            return DropdownMenuItem<String>(
              value: value,
              child: Text(value),
            );
          }).toList(),
        ),
      ),
    );
  }

  void _getCurrentLocation() {
    // TODO: Implement location fetching
    _addressController.text = 'Current Location';
  }

  void _selectTime() async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
    );
    if (picked != null && picked != _selectedTime) {
      setState(() {
        _selectedTime = picked;
      });
    }
  }

  void _submitSchedule(_ViewModel vm) {
    if (_formKey.currentState!.validate()) {
      if ((_selectedFrequency == 'Weekly' || _selectedFrequency == 'Bi-Weekly') && 
          _selectedDays.isEmpty) {
        Get.snackbar(
          'Error',
          'Please select at least one day',
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
        return;
      }

      final scheduleData = {
        'waste_type': _selectedWasteType,
        'frequency': _selectedFrequency,
        'days': _selectedDays,
        'time': '${_selectedTime.hour}:${_selectedTime.minute}',
        'address': _addressController.text,
        'description': _descriptionController.text,
      };

      vm.controller.schedulePickup(scheduleData);
      
      Get.snackbar(
        'Success',
        'Pickup schedule created successfully',
        backgroundColor: Colors.green,
        colorText: Colors.white,
      );
      
      Get.back();
    }
  }
}

class _ViewModel {
  final AppState state;
  final CustomerController controller;

  _ViewModel({
    required this.state,
    required this.controller,
  });
}