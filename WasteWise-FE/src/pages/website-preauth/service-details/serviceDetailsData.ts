// Service details data for WasteWise waste management services
import {
    IconTruck,
    IconBuilding,
    IconPackage,
    IconRecycle,
    IconWorld,
    IconBox,
    IconUsers,
    IconHome2,
    IconTrash,
    IconLeaf,
    IconSeedling,
    IconHeartHandshake
} from '@tabler/icons-react';

export const serviceDetails = [
    // Smart Waste Management Services
    {
        id: 'smart-bins',
        title: 'Smart Bin Monitoring',
        description: 'Revolutionary IoT-enabled smart bins that transform waste collection with real-time monitoring, automated alerts, and intelligent route optimization. Our cutting-edge sensors track fill levels, monitor waste quality, and predict collection needs to optimize efficiency while reducing operational costs and environmental impact.',
        category: 'Smart Technology',
        icon: IconTrash,
        features: ['Real-time Fill Level Sensors', 'Automated Collection Alerts', 'GPS Route Optimization', '24/7 Remote Monitoring', 'Data Analytics Dashboard', 'Mobile App Integration'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From GHS 150/month',
        duration: 'Real-time monitoring',
        popular: true,
        subtitle: 'AI-powered smart bins for efficient waste management',
        gallery: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'First smart bin network in Ghana with proven IoT technology',
            'Reduce collection costs by up to 40% with optimized routes',
            'Real-time monitoring prevents overflow and maintains cleanliness',
            'EPA-certified and environmentally compliant systems',
            'Professional installation and 24/7 technical support'
        ],
        process: [
            { step: 1, title: 'Site Assessment', description: 'Free evaluation of your location and waste patterns' },
            { step: 2, title: 'Installation', description: 'Professional smart bin installation with sensor calibration' },
            { step: 3, title: 'Configuration', description: 'Setup mobile app and dashboard access for monitoring' },
            { step: 4, title: 'Monitoring', description: '24/7 automated monitoring with real-time alerts' },
            { step: 5, title: 'Optimization', description: 'Continuous route and collection schedule optimization' }
        ],
        faqs: [
            { question: 'How do smart bins work?', answer: 'Our smart bins use ultrasonic sensors to measure fill levels and wireless connectivity to send real-time data to our monitoring platform.' },
            { question: 'What happens if the sensor fails?', answer: 'All sensors have battery backup and we provide immediate replacement within 24 hours of any reported issues.' },
            { question: 'Can I track multiple bins?', answer: 'Yes, our dashboard allows you to monitor unlimited bins across multiple locations from a single interface.' },
            { question: 'Is installation included?', answer: 'Yes, professional installation, sensor calibration, and initial training are included in the service package.' }
        ],
        stats: {
            binsDeployed: '1,000+',
            averageRating: '4.9',
            costSavings: '40%',
            responseTime: '2 hours'
        }
    },
    {
        id: 'residential-collection',
        title: 'Residential Waste Collection',
        description: 'Comprehensive household waste collection services designed for Ghanaian families, featuring flexible scheduling, eco-friendly separation systems, and convenient pickup options. Our reliable teams ensure your home stays clean while contributing to Ghana\'s circular economy through proper waste sorting and recycling.',
        category: 'Residential Services',
        icon: IconHome2,
        features: ['Flexible Weekly/Bi-weekly Scheduling', 'Waste Separation & Recycling', 'SMS/App Notifications', 'Missed Collection Makeup', 'Holiday Schedule Adjustments', 'Eco-friendly Collection Bags'],
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From GHS 80/month',
        duration: 'Weekly collection',
        popular: true,
        subtitle: 'Reliable household waste collection for every Ghanaian home',
        gallery: [
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Serving 10,000+ households across Greater Accra',
            'EPA-licensed waste collection with proper disposal',
            'Flexible scheduling to fit your family\'s needs',
            'Educational support for proper waste separation',
            'Mobile app for easy schedule management and payments'
        ],
        process: [
            { step: 1, title: 'Sign Up', description: 'Choose your collection schedule and service options online' },
            { step: 2, title: 'Setup', description: 'Receive collection bags and waste separation guidelines' },
            { step: 3, title: 'Collection', description: 'Regular pickup on your scheduled days with SMS reminders' },
            { step: 4, title: 'Processing', description: 'Waste sorted and processed at certified facilities' },
            { step: 5, title: 'Reporting', description: 'Monthly impact reports showing your environmental contribution' }
        ],
        faqs: [
            { question: 'What types of waste do you collect?', answer: 'We collect general household waste, recyclables (plastic, paper, glass), and organic waste. Hazardous materials require special handling.' },
            { question: 'What if I miss my collection day?', answer: 'Use our mobile app to reschedule or request a makeup collection within 48 hours at no extra charge.' },
            { question: 'Do you provide waste bags?', answer: 'Yes, we provide eco-friendly collection bags and recycling containers as part of your monthly service.' },
            { question: 'Can I change my collection schedule?', answer: 'Yes, you can modify your schedule anytime through our mobile app or customer service.' }
        ],
        stats: {
            householdsServed: '10,000+',
            averageRating: '4.8',
            wasteRecycled: '85%',
            onTimeRate: '96%'
        }
    },
    {
        id: 'commercial-waste',
        title: 'Commercial Waste Management',
        description: 'Tailored waste management solutions for businesses, offices, hotels, restaurants, and commercial establishments across Ghana. Our comprehensive service includes waste audits, custom collection schedules, compliance management, and cost optimization strategies designed to meet your business needs while maintaining environmental responsibility.',
        category: 'Commercial Services',
        icon: IconBuilding,
        features: ['Custom Collection Schedules', 'Waste Audits & Analytics', 'Compliance Management', 'Cost Optimization', 'Contract Services', 'Bulk Collection Options'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Custom Quote',
        duration: 'Flexible scheduling',
        popular: false,
        subtitle: 'Professional waste solutions for businesses of all sizes',
        gallery: [
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Serving 500+ businesses across Ghana with custom solutions',
            'EPA-certified commercial waste handling and disposal',
            'Flexible contracts from monthly to multi-year agreements',
            'Dedicated account managers for personalized service',
            'Cost reduction strategies and waste optimization audits'
        ],
        process: [
            { step: 1, title: 'Waste Audit', description: 'Comprehensive assessment of your current waste streams' },
            { step: 2, title: 'Custom Plan', description: 'Tailored waste management plan with cost optimization' },
            { step: 3, title: 'Implementation', description: 'Setup collection schedules and waste separation systems' },
            { step: 4, title: 'Monitoring', description: 'Regular monitoring and performance optimization' },
            { step: 5, title: 'Reporting', description: 'Monthly compliance and environmental impact reports' }
        ],
        faqs: [
            { question: 'What types of commercial waste do you handle?', answer: 'We handle general office waste, food service waste, retail waste, industrial waste, and recyclables. Hazardous materials require special arrangements.' },
            { question: 'Do you offer emergency collections?', answer: 'Yes, we provide emergency and on-demand collections for unexpected waste accumulation situations.' },
            { question: 'What are your contract terms?', answer: 'We offer flexible contracts from month-to-month to multi-year agreements based on your business needs.' },
            { question: 'Do you provide waste reduction consulting?', answer: 'Yes, our waste audits include recommendations for waste reduction, cost savings, and environmental improvements.' }
        ],
        stats: {
            businessesServed: '500+',
            averageRating: '4.7',
            costReduction: '30%',
            complianceRate: '100%'
        }
    },
    {
        id: 'recycling',
        title: 'Recycling Services',
        description: 'Comprehensive recycling programs for plastic, paper, glass, and metal waste with state-of-the-art sorting facilities and quality control systems. Our advanced recycling processes ensure maximum material recovery while supporting Ghana\'s transition to a circular economy through innovative buyback programs and community engagement.',
        category: 'Recycling',
        icon: IconRecycle,
        features: ['Multi-material Processing', 'Advanced Sorting Facilities', 'Quality Control Systems', 'Buyback Programs', 'Material Certificates', 'Environmental Reporting'],
        image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Earn while recycling',
        duration: 'Daily processing',
        popular: true,
        subtitle: 'Turn your waste into valuable resources with our recycling programs',
        gallery: [
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Ghana\'s largest recycling network with 95% recovery rate',
            'Competitive buyback rates for clean recyclable materials',
            'Advanced sorting and processing technology',
            'EPA-certified recycling processes and quality standards',
            'Direct partnerships with manufacturers for material offtake'
        ],
        process: [
            { step: 1, title: 'Collection', description: 'Pick up recyclables from your location or drop-off centers' },
            { step: 2, title: 'Sorting', description: 'Advanced automated and manual sorting by material type' },
            { step: 3, title: 'Cleaning', description: 'Industrial washing and preparation for processing' },
            { step: 4, title: 'Processing', description: 'Transform materials into new raw materials' },
            { step: 5, title: 'Manufacturing', description: 'Supply processed materials to manufacturing partners' }
        ],
        faqs: [
            { question: 'What materials do you accept for recycling?', answer: 'We accept PET bottles, HDPE containers, aluminum cans, steel cans, cardboard, office paper, and glass bottles. All materials must be clean and sorted.' },
            { question: 'How much do you pay for recyclables?', answer: 'Prices vary by material type and market conditions. Current rates are available on our app and website, updated weekly.' },
            { question: 'Where are your drop-off centers?', answer: 'We have drop-off centers across Accra, Kumasi, and Takoradi. Use our app to find the nearest location.' },
            { question: 'Do you offer pickup services?', answer: 'Yes, we provide scheduled pickup for large quantities and commercial recyclers. Minimum quantities apply.' }
        ],
        stats: {
            materialsProcessed: '50,000+ tons',
            recoveryRate: '95%',
            dropOffCenters: '25+',
            payoutTotal: 'GHS 2M+'
        }
    },
    {
        id: 'e-waste',
        title: 'E-Waste Collection',
        description: 'Safe disposal and recycling of electronic waste including computers, phones, batteries, and electronic components. Our certified e-waste processing ensures data destruction, valuable component recovery, and environmentally responsible disposal of hazardous materials while recovering precious metals and rare earth elements.',
        category: 'Specialized Waste',
        icon: IconBox,
        features: ['Certified Data Destruction', 'Component Recovery', 'Precious Metal Extraction', 'Pickup Service', 'Compliance Certificates', 'Asset Recovery'],
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Free collection',
        duration: 'Same-day pickup',
        popular: false,
        subtitle: 'Secure and environmentally responsible electronic waste disposal',
        gallery: [
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'EPA-certified e-waste processing facility in Ghana',
            'Secure data destruction with certificates of destruction',
            'Recovery of valuable materials like gold, silver, and copper',
            'Free collection service for qualifying quantities',
            'Compliance with international e-waste standards'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Inventory and evaluation of electronic equipment' },
            { step: 2, title: 'Collection', description: 'Secure pickup and transport to processing facility' },
            { step: 3, title: 'Data Destruction', description: 'Certified secure data wiping and hard drive destruction' },
            { step: 4, title: 'Disassembly', description: 'Careful disassembly and component separation' },
            { step: 5, title: 'Recovery', description: 'Material recovery and environmentally safe disposal' }
        ],
        faqs: [
            { question: 'What electronics do you accept?', answer: 'We accept computers, laptops, phones, tablets, batteries, printers, and most electronic devices. Some restrictions apply for CRT monitors.' },
            { question: 'Is data destruction included?', answer: 'Yes, certified data destruction is included for all storage devices with certificates provided.' },
            { question: 'Do you pay for e-waste?', answer: 'We may pay for certain high-value electronics and bulk quantities. Contact us for evaluation.' },
            { question: 'What happens to the materials?', answer: 'Valuable materials are recovered and sold to manufacturers. Hazardous materials are disposed of safely according to EPA standards.' }
        ],
        stats: {
            devicesProcessed: '5,000+',
            dataDestroyed: '100% secure',
            materialsRecovered: '85%',
            certifications: '5+ standards'
        }
    },
    {
        id: 'composting',
        title: 'Organic Waste Composting',
        description: 'Convert organic waste into nutrient-rich compost for agricultural use through our industrial composting facilities. Our controlled composting process transforms food waste, garden waste, and other organic materials into premium soil conditioner that supports Ghana\'s agricultural productivity and food security.',
        category: 'Organic Processing',
        icon: IconSeedling,
        features: ['Food Waste Processing', 'Garden Waste Collection', 'Industrial Composting', 'Quality Testing', 'Agricultural Sales', 'Soil Amendment'],
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From GHS 50/month',
        duration: '60-day process',
        popular: false,
        subtitle: 'Transform organic waste into valuable compost for agriculture',
        gallery: [
            'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Ghana\'s largest composting facility processing 15,000+ tons annually',
            'Advanced aerated static pile composting technology',
            'Quality tested compost meeting international standards',
            'Partnerships with local farmers and agricultural cooperatives',
            'Reduces methane emissions from organic waste in landfills'
        ],
        process: [
            { step: 1, title: 'Collection', description: 'Separate collection of organic waste materials' },
            { step: 2, title: 'Preparation', description: 'Sorting, shredding, and mixing organic materials' },
            { step: 3, title: 'Composting', description: '60-day controlled composting with regular turning' },
            { step: 4, title: 'Testing', description: 'Quality testing for nutrients and contaminants' },
            { step: 5, title: 'Distribution', description: 'Packaging and distribution to agricultural markets' }
        ],
        faqs: [
            { question: 'What organic materials do you accept?', answer: 'We accept food scraps, garden trimmings, market waste, and agricultural residues. No meat, dairy, or oils in residential programs.' },
            { question: 'How long does composting take?', answer: 'Our industrial composting process takes 60-90 days to produce finished compost.' },
            { question: 'Can I buy compost from you?', answer: 'Yes, we sell premium compost to farmers, landscapers, and home gardeners. Bulk and bagged options available.' },
            { question: 'Do you offer commercial composting?', answer: 'Yes, we provide commercial composting services for restaurants, hotels, markets, and food processors.' }
        ],
        stats: {
            organicProcessed: '15,000+ tons',
            compostProduced: '5,000+ tons',
            farmersSupplied: '200+',
            emissionsReduced: '30%'
        }
    },
    {
        id: 'construction-waste',
        title: 'Construction Debris Removal',
        description: 'Efficient removal of construction and demolition waste with proper disposal, material sorting, and debris recycling services. Our specialized equipment and experienced teams handle everything from small renovation projects to large-scale construction sites while ensuring environmental compliance and cost-effective solutions.',
        category: 'Construction Services',
        icon: IconTruck,
        features: ['Heavy Equipment', 'Material Sorting', 'Debris Recycling', 'Site Cleanup', 'Permit Assistance', 'Same-day Service'],
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From GHS 200/load',
        duration: 'Same-day service',
        popular: false,
        subtitle: 'Professional construction waste removal with recycling focus',
        gallery: [
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Served 1,000+ construction projects across Ghana',
            'Heavy-duty equipment for all types of construction debris',
            'EPA-compliant disposal and recycling processes',
            'Same-day emergency cleanup services available',
            'Material sorting and recycling to minimize landfill waste'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Site evaluation and debris volume estimation' },
            { step: 2, title: 'Preparation', description: 'Equipment deployment and safety setup' },
            { step: 3, title: 'Removal', description: 'Efficient loading and hauling of construction debris' },
            { step: 4, title: 'Sorting', description: 'Material separation for recycling and disposal' },
            { step: 5, title: 'Cleanup', description: 'Final site cleanup and debris-free certification' }
        ],
        faqs: [
            { question: 'What types of construction debris do you handle?', answer: 'We handle concrete, wood, metal, drywall, roofing materials, and general construction waste. Hazardous materials require special arrangements.' },
            { question: 'Do you provide same-day service?', answer: 'Yes, we offer same-day emergency cleanup services for urgent construction waste removal needs.' },
            { question: 'What equipment do you use?', answer: 'We use heavy-duty trucks, dumpsters, excavators, and specialized hauling equipment for efficient debris removal.' },
            { question: 'Do you sort materials for recycling?', answer: 'Yes, we sort materials at our facility to maximize recycling and minimize landfill disposal.' }
        ],
        stats: {
            projectsCompleted: '1,000+',
            debrisRecycled: '70%',
            responseTime: '4 hours',
            equipmentFleet: '25+ vehicles'
        }
    },
    {
        id: 'medical-waste',
        title: 'Medical Waste Management',
        description: 'Specialized handling and disposal of medical and hazardous waste materials with strict compliance to health regulations. Our certified medical waste management services ensure safe collection, transport, treatment, and disposal of biohazardous materials from healthcare facilities, laboratories, and research institutions.',
        category: 'Specialized Waste',
        icon: IconHeartHandshake,
        features: ['Biohazard Handling', 'Secure Transport', 'Incineration Services', 'Compliance Tracking', 'Documentation', 'Emergency Response'],
        image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Custom Quote',
        duration: 'Scheduled collection',
        popular: false,
        subtitle: 'Certified medical waste disposal with full regulatory compliance',
        gallery: [
            'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'EPA and Ministry of Health certified medical waste facility',
            'Serving 100+ healthcare facilities across Ghana',
            'Secure chain of custody with complete documentation',
            'Emergency response for medical waste spills and incidents',
            'State-of-the-art incineration and treatment technology'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Medical waste stream evaluation and compliance review' },
            { step: 2, title: 'Collection', description: 'Secure pickup with certified medical waste containers' },
            { step: 3, title: 'Transport', description: 'Safe transport to licensed treatment facility' },
            { step: 4, title: 'Treatment', description: 'Incineration or autoclaving according to waste type' },
            { step: 5, title: 'Documentation', description: 'Complete manifests and certificates of destruction' }
        ],
        faqs: [
            { question: 'What types of medical waste do you handle?', answer: 'We handle pathological waste, pharmaceutical waste, sharps, cultures, and other regulated medical waste materials.' },
            { question: 'Are you licensed for medical waste?', answer: 'Yes, we are fully licensed by EPA and Ministry of Health for medical waste collection, transport, and disposal.' },
            { question: 'How often do you collect medical waste?', answer: 'We provide scheduled collection services from daily to weekly based on your facility\'s needs.' },
            { question: 'Do you provide emergency services?', answer: 'Yes, we offer 24/7 emergency response for medical waste spills and urgent disposal needs.' }
        ],
        stats: {
            facilitiesServed: '100+',
            wasteProcessed: '500+ tons',
            complianceRate: '100%',
            responseTime: '2 hours'
        }
    },
    {
        id: 'on-demand',
        title: 'On-Demand Pickup',
        description: 'Request immediate waste pickup through our mobile app - the Uber for waste management. Our innovative on-demand service provides instant booking, live tracking, transparent pricing, and quick response for all types of waste collection needs across Ghana\'s major cities.',
        category: 'Digital Services',
        icon: IconTruck,
        features: ['Instant Booking', 'Live GPS Tracking', 'Multiple Waste Types', 'Transparent Pricing', 'Mobile App', 'Digital Payments'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From GHS 20/pickup',
        duration: '2-hour response',
        popular: true,
        subtitle: 'Instant waste pickup at your fingertips with our mobile app',
        gallery: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'First on-demand waste pickup app in Ghana',
            'Average 2-hour response time across major cities',
            'Transparent upfront pricing with no hidden fees',
            'Real-time tracking like Uber or Bolt for deliveries',
            'Support for all waste types including recyclables'
        ],
        process: [
            { step: 1, title: 'Book', description: 'Open app, select waste type, and schedule pickup' },
            { step: 2, title: 'Confirm', description: 'Get instant price quote and confirm your request' },
            { step: 3, title: 'Track', description: 'Track your collector in real-time via GPS' },
            { step: 4, title: 'Pickup', description: 'Collector arrives and picks up your waste' },
            { step: 5, title: 'Pay', description: 'Automatic payment through app with digital receipt' }
        ],
        faqs: [
            { question: 'How quickly can you collect my waste?', answer: 'Our average response time is 2 hours in Accra, Kumasi, and Takoradi during business hours.' },
            { question: 'What types of waste can I book pickup for?', answer: 'General waste, recyclables, e-waste, organic waste, and bulky items. Some restrictions apply for hazardous materials.' },
            { question: 'How do I pay for the service?', answer: 'Payment is automatic through the app using mobile money, credit card, or digital wallet.' },
            { question: 'Can I schedule pickup for later?', answer: 'Yes, you can schedule pickups up to 7 days in advance or request immediate collection.' }
        ],
        stats: {
            responseTime: '2 hours avg',
            citiesServed: '10+',
            appDownloads: '50,000+',
            completionRate: '98%'
        }
    },
    {
        id: 'bulk-waste',
        title: 'Bulk Waste Collection',
        description: 'Large-scale waste removal for events, cleanups, and special occasions with specialized equipment and experienced teams. Our bulk waste collection services handle everything from community cleanups and festival waste to large residential cleanouts and commercial waste clearance.',
        category: 'Special Events',
        icon: IconUsers,
        features: ['Event Support', 'Large Volume Handling', 'Quick Response', 'Equipment Rental', 'Cleanup Crews', 'Waste Sorting'],
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From GHS 500/event',
        duration: 'Custom scheduling',
        popular: false,
        subtitle: 'Large-scale waste solutions for events and bulk collections',
        gallery: [
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Managed 200+ large-scale events and cleanups',
            'Specialized equipment for high-volume waste collection',
            'Professional cleanup crews with full equipment',
            'Event planning support and waste management consulting',
            'Flexible scheduling including weekends and holidays'
        ],
        process: [
            { step: 1, title: 'Planning', description: 'Event assessment and waste management plan creation' },
            { step: 2, title: 'Setup', description: 'Equipment deployment and waste collection point setup' },
            { step: 3, title: 'Collection', description: 'Continuous collection during event or bulk pickup' },
            { step: 4, title: 'Sorting', description: 'On-site or facility-based waste sorting and processing' },
            { step: 5, title: 'Cleanup', description: 'Final site cleanup and restoration to original condition' }
        ],
        faqs: [
            { question: 'What size events do you support?', answer: 'We support events from 100 to 50,000+ attendees with scalable waste management solutions.' },
            { question: 'Do you provide bins and equipment?', answer: 'Yes, we provide all necessary bins, containers, and collection equipment for events.' },
            { question: 'Can you handle same-day requests?', answer: 'For urgent bulk collections, we offer same-day service based on equipment availability.' },
            { question: 'Do you sort waste at events?', answer: 'Yes, we provide on-site sorting or comprehensive sorting at our facilities.' }
        ],
        stats: {
            eventsSupported: '200+',
            wasteProcessed: '5,000+ tons',
            teamSize: '50+ staff',
            equipmentFleet: '30+ vehicles'
        }
    },
    {
        id: 'plastic-recovery',
        title: 'Plastic Recovery Program',
        description: 'Dedicated plastic waste collection and recycling program to combat pollution with specialized sorting, ocean cleanup initiatives, community collection points, and reward systems. Our comprehensive plastic recovery program addresses Ghana\'s plastic pollution challenge while creating economic opportunities.',
        category: 'Environmental Protection',
        icon: IconRecycle,
        features: ['Plastic Sorting', 'Ocean Cleanup', 'Community Collection', 'Reward System', 'Pollution Prevention', 'Economic Incentives'],
        image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Earn rewards',
        duration: 'Ongoing program',
        popular: true,
        subtitle: 'Combat plastic pollution while earning rewards for your community',
        gallery: [
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            '80% plastic recovery rate from collected waste streams',
            'Community reward programs with cash incentives',
            'Ocean and waterway cleanup initiatives',
            'Partnership with international plastic pollution NGOs',
            'Advanced plastic sorting and processing technology'
        ],
        process: [
            { step: 1, title: 'Collection', description: 'Community collection points and ocean cleanup drives' },
            { step: 2, title: 'Sorting', description: 'Advanced sorting by plastic type and quality grade' },
            { step: 3, title: 'Cleaning', description: 'Industrial washing and contamination removal' },
            { step: 4, title: 'Processing', description: 'Shredding and pelletizing for manufacturing use' },
            { step: 5, title: 'Rewards', description: 'Community payments and environmental impact rewards' }
        ],
        faqs: [
            { question: 'What plastics do you accept?', answer: 'We accept PET bottles, HDPE containers, plastic bags, and most clean plastic packaging. Payment rates vary by type.' },
            { question: 'How much do you pay for plastic waste?', answer: 'Rates range from GHS 0.50-2.00 per kg depending on plastic type and cleanliness. Updated rates available on our app.' },
            { question: 'Where are collection points located?', answer: 'We have collection points in all major communities. Use our app to find the nearest location.' },
            { question: 'Do you organize community cleanups?', answer: 'Yes, we organize monthly beach and community cleanups with rewards for participants.' }
        ],
        stats: {
            plasticRecovered: '2,000+ tons',
            recoveryRate: '80%',
            rewardsPaid: 'GHS 500,000+',
            communitiesServed: '50+'
        }
    },
    {
        id: 'education',
        title: 'Community Education',
        description: 'Waste management education and awareness programs for communities, schools, and organizations with interactive workshops, training sessions, awareness campaigns, and green ambassador programs. Building environmental consciousness and sustainable practices across Ghana.',
        category: 'Education & Awareness',
        icon: IconUsers,
        features: ['School Programs', 'Workshop Training', 'Awareness Campaigns', 'Green Ambassadors', 'Community Outreach', 'Educational Materials'],
        image: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Free programs',
        duration: 'Ongoing',
        popular: false,
        subtitle: 'Building environmental awareness through education and community engagement',
        gallery: [
            'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Delivered 500+ educational programs across Ghana',
            'Certified environmental educators and trainers',
            'Interactive educational materials in local languages',
            'Partnership with schools and community organizations',
            'Measurable impact on community waste management practices'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Community needs assessment and program customization' },
            { step: 2, title: 'Planning', description: 'Educational program design and material preparation' },
            { step: 3, title: 'Training', description: 'Interactive workshops and hands-on training sessions' },
            { step: 4, title: 'Implementation', description: 'Community program launch and ongoing support' },
            { step: 5, title: 'Follow-up', description: 'Impact measurement and continuous improvement' }
        ],
        faqs: [
            { question: 'Are your programs free for schools?', answer: 'Yes, all educational programs for schools and community groups are provided free of charge.' },
            { question: 'What age groups do you teach?', answer: 'We have programs for all ages from kindergarten through adult community education.' },
            { question: 'Do you provide materials in local languages?', answer: 'Yes, our materials are available in English, Twi, Ga, Ewe, and other major Ghanaian languages.' },
            { question: 'How do I schedule a program?', answer: 'Contact our education team through our website or call to schedule a free assessment and program planning session.' }
        ],
        stats: {
            programsDelivered: '500+',
            studentsReached: '50,000+',
            schoolsPartnered: '200+',
            communitiesServed: '100+'
        }
    }
];

export function getServiceDetailById(id: string) {
    return serviceDetails.find(s => s.id === id);
} 

export function getAllowedCategoriesByServiceTitle(serviceTitle: string): string[] {
    switch (serviceTitle) {
        case 'Smart Bin Monitoring':
            return ['Smart Technology'];
        case 'Residential Waste Collection':
            return ['Residential Services'];
        case 'Commercial Waste Management':
            return ['Commercial Services'];
        case 'Recycling Services':
            return ['Recycling'];
        case 'E-Waste Collection':
            return ['Specialized Waste'];
        case 'Organic Waste Composting':
            return ['Organic Processing'];
        case 'Construction Debris Removal':
            return ['Construction Services'];
        case 'Medical Waste Management':
            return ['Specialized Waste'];
        case 'On-Demand Pickup':
            return ['Digital Services'];
        case 'Bulk Waste Collection':
            return ['Special Events'];
        case 'Plastic Recovery Program':
            return ['Environmental Protection'];
        case 'Community Education':
            return ['Education & Awareness'];
        default:
            return [];
    }
}
