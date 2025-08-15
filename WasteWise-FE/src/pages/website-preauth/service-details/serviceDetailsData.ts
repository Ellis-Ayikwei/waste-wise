// Service details data for homepage
import {
    IconTruck,
    IconBuilding,
    IconPackage,
    IconPiano,
    IconWorld,
    IconBox,
    IconUsers,
    IconHome2,
    IconSofa,
    IconMusic,
    IconPackageImport,
    IconArrowsMaximize,
    IconGlass,
    IconCar,
    IconMotorbike,
    IconSchool,
    IconShield,
    IconClock,
    IconMapPin,
    IconStar,
    IconCheck,
    IconPhone,
    IconMail,
    IconCalendar
} from '@tabler/icons-react';

export const serviceDetails = [
    // Removals & Storage
    {
        id: 'home-removals',
        title: 'Home Removals',
        description: 'Professional home removal services that transform the stress of moving into a seamless experience. Our expert teams handle everything from careful packing and furniture disassembly to secure transport and perfect placement in your new home. Whether you\'re moving across town or across the country, we provide comprehensive moving solutions with attention to detail that ensures your belongings arrive safely and your new home is set up exactly as you envision.',
        category: 'Removals & Storage',
        icon: IconHome2,
        features: ['Professional packing services', 'Furniture disassembly & assembly', 'Specialty item handling', 'Storage solutions available', 'Insurance coverage included'],
        image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From £299',
        duration: '4-8 hours',
        popular: true,
        subtitle: 'Professional home moving services with care and precision',
        gallery: [
            'https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Experienced moving teams with 5+ years average experience',
            'Full-service packing and unpacking included',
            'Comprehensive insurance coverage up to £50,000',
            'Flexible scheduling including weekends and evenings',
            'Professional equipment and protective materials'
        ],
        process: [
            { step: 1, title: 'Free Quote', description: 'Get an instant online quote or schedule a free home survey' },
            { step: 2, title: 'Planning', description: 'Our team creates a detailed moving plan tailored to your needs' },
            { step: 3, title: 'Packing Day', description: 'Professional packing with protective materials and labeling' },
            { step: 4, title: 'Moving Day', description: 'Careful loading, transport, and unloading at your new home' },
            { step: 5, title: 'Setup', description: 'Furniture assembly and placement assistance included' }
        ],
        faq: [
            { question: 'How far in advance should I book?', answer: 'We recommend booking at least 2-3 weeks in advance, especially during peak moving season (May-September).' },
            { question: 'Do you provide packing materials?', answer: 'Yes, we provide all necessary packing materials including boxes, bubble wrap, and protective blankets.' },
            { question: 'What if I need to reschedule?', answer: 'We offer flexible rescheduling up to 48 hours before your move date at no additional cost.' },
            { question: 'Do you handle specialty items?', answer: 'Yes, we have experience with pianos, artwork, antiques, and other valuable items.' }
        ],
        stats: {
            movesCompleted: '15,000+',
            averageRating: '4.8',
            satisfactionRate: '98%',
            insuranceCoverage: '£50,000'
        }
    },
    {
        id: 'international-removals',
        title: 'International Removals',
        description: 'Embark on your global journey with confidence through our comprehensive international removal services. We specialize in seamless cross-border relocations, handling complex customs procedures, documentation requirements, and international logistics with precision. From initial consultation to final delivery at your new international home, our experienced team manages every detail, ensuring your belongings travel safely across continents while you focus on your exciting new adventure abroad.',
        category: 'Removals & Storage',
        icon: IconWorld,
        features: ['Customs handling', 'Paperwork assistance', 'International logistics', 'Door-to-door service', 'Insurance included'],
        image: 'https://plus.unsplash.com/premium_photo-1679858780540-83cf9db66d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1531237570470-1b48560f2c99?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Custom Quote',
        duration: 'Varies',
        popular: false,
        subtitle: 'Seamless international relocations with expert customs handling',
        gallery: [
            'https://images.unsplash.com/photo-1531237570470-1b48560f2c99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://plus.unsplash.com/premium_photo-1679858780540-83cf9db66d55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'International moving specialists with 10+ years experience',
            'Complete customs documentation and clearance services',
            'Door-to-door delivery worldwide',
            'Comprehensive insurance coverage for international moves',
            'Dedicated move coordinator for personalized service'
        ],
        process: [
            { step: 1, title: 'Consultation', description: 'Free consultation to assess your international moving needs' },
            { step: 2, title: 'Documentation', description: 'Handle all customs paperwork and import/export documentation' },
            { step: 3, title: 'Packing', description: 'Professional packing with international shipping standards' },
            { step: 4, title: 'Shipping', description: 'Secure container shipping with tracking and monitoring' },
            { step: 5, title: 'Delivery', description: 'Door-to-door delivery and customs clearance at destination' }
        ],
        faq: [
            { question: 'How long does international shipping take?', answer: 'Shipping times vary by destination: 2-4 weeks for Europe, 4-8 weeks for other continents.' },
            { question: 'What customs documents do I need?', answer: 'We handle all customs documentation including import/export permits, inventory lists, and duty calculations.' },
            { question: 'Is insurance included for international moves?', answer: 'Yes, comprehensive marine insurance is included covering damage, loss, and delays.' },
            { question: 'Do you provide storage at destination?', answer: 'Yes, we offer secure storage facilities at major international destinations.' }
        ],
        stats: {
            countriesServed: '50+',
            averageRating: '4.9',
            satisfactionRate: '99%',
            insuranceCoverage: '£100,000'
        }
    },
    {
        id: 'office-removals',
        title: 'Office Removals',
        description: 'Minimize business disruption with our specialized office removal services designed for commercial environments. We understand that time is money, which is why our expert teams work efficiently to relocate your business with minimal downtime. From IT equipment and confidential documents to office furniture and specialized machinery, we handle every aspect of your commercial move with the utmost care and professionalism, ensuring your business operations resume smoothly in your new location.',
        category: 'Removals & Storage',
        icon: IconBuilding,
        features: ['After-hours moving available', 'IT equipment handling', 'Furniture reconfiguration', 'Document security', 'Minimal business disruption'],
        image: 'https://images.unsplash.com/photo-1692133226337-55e513450a32?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Custom Quote',
        duration: '1-3 days',
        popular: false,
        subtitle: 'Minimize downtime with professional office relocation services',
        gallery: [
            'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1692133226337-55e513450a32?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Specialized commercial moving teams with IT equipment expertise',
            'After-hours and weekend moving to minimize business disruption',
            'Secure handling of confidential documents and sensitive equipment',
            'Comprehensive project management and coordination services',
            'Post-move IT setup and furniture reconfiguration included'
        ],
        process: [
            { step: 1, title: 'Site Survey', description: 'Comprehensive assessment of current and new office spaces' },
            { step: 2, title: 'Planning', description: 'Detailed project timeline and resource allocation planning' },
            { step: 3, title: 'Preparation', description: 'Equipment labeling, packing, and IT system preparation' },
            { step: 4, title: 'Moving Day', description: 'Coordinated move with minimal disruption to operations' },
            { step: 5, title: 'Setup', description: 'IT reconnection, furniture assembly, and workspace configuration' }
        ],
        faq: [
            { question: 'Can you move during business hours?', answer: 'We offer after-hours and weekend moving to minimize disruption to your business operations.' },
            { question: 'Do you handle IT equipment?', answer: 'Yes, our teams are trained in safely moving computers, servers, and networking equipment.' },
            { question: 'What about confidential documents?', answer: 'We provide secure document handling with confidentiality agreements and secure transport.' },
            { question: 'How long does an office move typically take?', answer: 'Most office moves take 1-3 days depending on size and complexity.' }
        ],
        stats: {
            officesMoved: '500+',
            averageRating: '4.8',
            satisfactionRate: '97%',
            downtimeReduction: '80%'
        }
    },
    {
        id: 'student-removals',
        title: 'Student Removals',
        description: 'Navigate your academic journey with ease through our student-focused removal services. We understand the unique challenges of student life, from tight budgets to hectic schedules, and have designed our services specifically for university students. Whether you\'re moving between dormitories, shared houses, or returning home for the holidays, our affordable and flexible solutions ensure your belongings are safely transported without breaking the bank or disrupting your studies.',
        category: 'Removals & Storage',
        icon: IconSchool,
        features: ['Affordable rates', 'Flexible scheduling', 'Small load specialists', 'Storage between terms', 'Weekend availability'],
        image: 'https://images.unsplash.com/photo-1580188911874-f95af62924ee?q=80&w=1090&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1519070994522-88c6b756330e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From £25',
        duration: '1-3 hours',
        popular: true,
        subtitle: 'Affordable moving solutions designed specifically for students',
        gallery: [
            'https://images.unsplash.com/photo-1519070994522-88c6b756330e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1580188911874-f95af62924ee?q=80&w=1090&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1523050854058-8df90110c9e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Student-friendly pricing with no hidden fees',
            'Flexible scheduling including weekends and evenings',
            'Small load specialists perfect for student belongings',
            'Storage solutions between academic terms',
            'University area experts with local knowledge'
        ],
        process: [
            { step: 1, title: 'Quick Quote', description: 'Instant online quote based on room size and distance' },
            { step: 2, title: 'Booking', description: 'Flexible booking with same-day and next-day options' },
            { step: 3, title: 'Moving Day', description: 'Efficient loading and transport of student belongings' },
            { step: 4, title: 'Delivery', description: 'Careful unloading and placement in new accommodation' },
            { step: 5, title: 'Storage', description: 'Optional storage services for between-term periods' }
        ],
        faq: [
            { question: 'Do you offer student discounts?', answer: 'Yes, we offer special student pricing and can provide student ID verification for additional discounts.' },
            { question: 'Can you help with storage between terms?', answer: 'Yes, we offer affordable storage solutions perfect for keeping belongings between academic terms.' },
            { question: 'Do you work on weekends?', answer: 'Yes, we offer weekend and evening appointments to fit around your class schedule.' },
            { question: 'What if I only have a small amount to move?', answer: 'We specialize in small loads and offer affordable rates for single room moves.' }
        ],
        stats: {
            studentsHelped: '12,000+',
            averageRating: '4.6',
            satisfactionRate: '95%',
            averageCost: '£45'
        }
    },
    {
        id: 'storage-services',
        title: 'Storage Services',
        description: 'Discover flexible and secure storage solutions that adapt to your changing needs. Whether you require short-term storage during a home renovation, long-term storage for seasonal items, or a secure space for valuable possessions, our state-of-the-art facilities provide the perfect solution. With 24/7 access, climate-controlled units, and comprehensive insurance options, we offer peace of mind knowing your belongings are safe, secure, and easily accessible whenever you need them.',
        category: 'Removals & Storage',
        icon: IconBox,
        features: ['Flexible terms', '24/7 access available', 'Insurance options', 'Collection & delivery', 'Secure facilities'],
        image: 'https://images.unsplash.com/photo-1662320154145-7263e998e7a2?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From £20/week',
        duration: 'Flexible',
        popular: false,
        subtitle: 'Secure storage solutions with flexible terms and 24/7 access',
        gallery: [
            'https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1662320154145-7263e998e7a2?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1586864387789-628af9feed72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Secure facilities with 24/7 CCTV monitoring',
            'Flexible storage terms from weekly to long-term',
            'Climate-controlled units for sensitive items',
            'Collection and delivery services available',
            'Comprehensive insurance options included'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Evaluate your storage needs and recommend appropriate unit size' },
            { step: 2, title: 'Booking', description: 'Reserve your storage unit with flexible payment options' },
            { step: 3, title: 'Collection', description: 'Professional collection service from your location' },
            { step: 4, title: 'Storage', description: 'Secure storage with 24/7 access and monitoring' },
            { step: 5, title: 'Delivery', description: 'On-demand delivery service when you need your items' }
        ],
        faq: [
            { question: 'What sizes of storage units do you offer?', answer: 'We offer units from 25 sq ft to 200 sq ft, suitable for anything from a few boxes to full house contents.' },
            { question: 'Do you provide collection and delivery?', answer: 'Yes, we offer professional collection and delivery services for your convenience.' },
            { question: 'Is insurance included?', answer: 'Basic insurance is included, with additional coverage options available for valuable items.' },
            { question: 'Can I access my storage unit anytime?', answer: 'Yes, we offer 24/7 access to your storage unit with secure key card entry.' }
        ],
        stats: {
            storageUnits: '500+',
            averageRating: '4.7',
            satisfactionRate: '96%',
            securityUptime: '99.9%'
        }
    },
    // Man & Van Services
    {
        id: 'furniture-appliance-delivery',
        title: 'Furniture & Appliance Delivery',
        description: 'Transform your space with our comprehensive furniture and appliance delivery service that goes beyond simple transport. We don\'t just deliver your items – we ensure they\'re perfectly positioned and properly set up in your home. From delicate antiques to heavy appliances, our experienced team handles every item with the care it deserves, providing professional assembly, old furniture removal, and protective measures to safeguard your home during the delivery process.',
        category: 'Man & Van Services',
        icon: IconSofa,
        features: [
            'Assembly included',
            'Old furniture removal',
            'Protection of floors and walls',
            'Quality inspection',
            'Waste disposal'
        ],
        image: 'https://images.unsplash.com/photo-1645526816819-f4c8cdaf47fc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From £45',
        duration: '2-4 hours',
        popular: true,
        subtitle: 'Professional furniture delivery with assembly and setup included',
        gallery: [
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1645526816819-f4c8cdaf47fc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Experienced furniture delivery specialists',
            'Professional assembly and setup services included',
            'Protective materials to safeguard your home',
            'Old furniture removal and disposal service',
            'Same-day and next-day delivery options available'
        ],
        process: [
            { step: 1, title: 'Booking', description: 'Easy online booking with instant quote and flexible scheduling' },
            { step: 2, title: 'Preparation', description: 'Our team prepares protective materials and equipment' },
            { step: 3, title: 'Delivery', description: 'Careful delivery with floor and wall protection' },
            { step: 4, title: 'Assembly', description: 'Professional assembly and placement of furniture' },
            { step: 5, title: 'Cleanup', description: 'Removal of packaging and old furniture disposal' }
        ],
        faq: [
            { question: 'Do you assemble furniture?', answer: 'Yes, professional assembly is included in our service for all furniture items.' },
            { question: 'What if I need to remove old furniture?', answer: 'We offer old furniture removal and disposal services for an additional fee.' },
            { question: 'Do you protect floors and walls?', answer: 'Yes, we use protective materials including floor runners, corner guards, and furniture blankets.' },
            { question: 'What if the furniture arrives damaged?', answer: 'We conduct a thorough inspection upon delivery and handle any damage claims immediately.' }
        ],
        stats: {
            deliveriesCompleted: '25,000+',
            averageRating: '4.7',
            satisfactionRate: '96%',
            assemblySuccess: '99%'
        }
    },
    {
        id: 'piano-delivery',
        title: 'Piano Delivery',
        description: 'Entrust your precious musical instrument to our piano delivery specialists who understand that a piano is more than just furniture – it\'s a cherished musical companion. Our certified piano movers combine decades of experience with specialized equipment to ensure your piano arrives at its destination in perfect condition. From grand pianos to uprights, we provide climate-controlled transport, professional tuning services, and meticulous attention to detail that preserves both the instrument\'s integrity and its beautiful sound.',
        category: 'Man & Van Services',
        icon: IconMusic,
        features: ['Specialized equipment', 'Trained professionals', 'Insurance coverage', 'Careful handling', 'Delivery & setup'],
        image: 'https://images.unsplash.com/photo-1725289154011-89aafdf4f08e?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From £150',
        duration: '2-4 hours',
        popular: false,
        subtitle: 'Expert piano moving with specialized equipment and trained professionals',
        gallery: [
            'https://images.unsplash.com/photo-1552422535-c45813c61732?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1725289154011-89aafdf4f08e?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Certified piano moving specialists with 15+ years experience',
            'Specialized equipment including piano dollies and ramps',
            'Climate-controlled transport for sensitive instruments',
            'Comprehensive insurance coverage up to £25,000',
            'Post-move tuning and setup services available'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Detailed assessment of piano type, size, and access requirements' },
            { step: 2, title: 'Preparation', description: 'Specialized wrapping and protection of the instrument' },
            { step: 3, title: 'Moving', description: 'Careful loading using professional piano moving equipment' },
            { step: 4, title: 'Transport', description: 'Secure transport with climate control and monitoring' },
            { step: 5, title: 'Setup', description: 'Professional placement and post-move tuning services' }
        ],
        faq: [
            { question: 'Do you move all types of pianos?', answer: 'Yes, we handle upright pianos, grand pianos, baby grands, and digital pianos.' },
            { question: 'What specialized equipment do you use?', answer: 'We use piano dollies, ramps, straps, and protective materials designed specifically for piano moving.' },
            { question: 'Do you provide tuning after the move?', answer: 'Yes, we offer post-move tuning services to ensure your piano sounds perfect in its new location.' },
            { question: 'How do you protect the piano during transport?', answer: 'We use specialized blankets, straps, and climate-controlled transport to protect your instrument.' }
        ],
        stats: {
            pianosMoved: '2,500+',
            averageRating: '4.9',
            satisfactionRate: '99%',
            insuranceCoverage: '£25,000'
        }
    },
    {
        id: 'parcel-delivery',
        title: 'Parcel Delivery',
        description: 'Experience lightning-fast parcel delivery that keeps pace with your busy lifestyle. Our same-day and next-day delivery services are designed for those moments when speed matters most. Whether you\'re sending important documents, fragile items, or packages up to 2 cubic meters, our professional team ensures your parcels are handled with care and delivered with precision. With real-time tracking, flexible scheduling, and competitive pricing, we make parcel delivery simple, reliable, and worry-free.',
        category: 'Man & Van Services',
        icon: IconPackage,
        features: [
            'Same day delivery available',
            'Up to 2 cubic meters',
            'Loading & unloading included',
            'No hidden charges',
            'Instant quotes'
        ],
        image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1561169653-c8f5beef564d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'From £30',
        duration: '1-2 hours',
        popular: true,
        subtitle: 'Fast and reliable parcel delivery with same-day options',
        gallery: [
            'https://images.unsplash.com/photo-1561169653-c8f5beef564d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Same-day and next-day delivery options available',
            'Professional handling of parcels up to 2 cubic meters',
            'Loading and unloading services included',
            'Real-time tracking and delivery confirmation',
            'Competitive pricing with no hidden charges'
        ],
        process: [
            { step: 1, title: 'Quote', description: 'Get instant online quote based on parcel size and delivery distance' },
            { step: 2, title: 'Booking', description: 'Schedule pickup and delivery with flexible time slots' },
            { step: 3, title: 'Pickup', description: 'Professional pickup with careful handling and documentation' },
            { step: 4, title: 'Delivery', description: 'Fast delivery with real-time tracking updates' },
            { step: 5, title: 'Confirmation', description: 'Delivery confirmation and proof of delivery provided' }
        ],
        faq: [
            { question: 'Do you offer same-day delivery?', answer: 'Yes, we offer same-day delivery for orders placed before 2 PM, subject to availability and location.' },
            { question: 'What size parcels can you handle?', answer: 'We can handle parcels up to 2 cubic meters in size, suitable for most household and business items.' },
            { question: 'Do you provide tracking?', answer: 'Yes, we provide real-time tracking so you can monitor your parcel throughout the journey.' },
            { question: 'What areas do you cover?', answer: 'We provide nationwide coverage with local same-day delivery in major cities.' }
        ],
        stats: {
            parcelsDelivered: '50,000+',
            averageRating: '4.6',
            satisfactionRate: '95%',
            onTimeDelivery: '98%'
        }
    },
    {
        id: 'ebay-delivery',
        title: 'eBay Delivery',
        description: 'Elevate your eBay business with our specialized delivery services that understand the unique needs of online marketplace transactions. We bridge the gap between virtual sales and physical delivery, providing seamless integration with eBay\'s platform for tracking and delivery confirmation. Whether you\'re a seller needing reliable delivery for your products or a buyer wanting secure receipt of your purchases, our service ensures smooth transactions with professional handling, secure packaging, and comprehensive proof of delivery.',
        category: 'Man & Van Services',
        icon: IconPackageImport,
        features: ['eBay integration', 'Secure packaging', 'Proof of delivery', 'Insurance coverage', 'Flexible scheduling'],
        image: 'https://images.unsplash.com/photo-1567570670849-79db9c45cd9d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1561169653-c8f5beef564d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Custom Quote',
        duration: 'Varies',
        popular: false,
        subtitle: 'Specialized delivery services for eBay sellers and buyers',
        gallery: [
            'https://images.unsplash.com/photo-1561169653-c8f5beef564d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1567570670849-79db9c45cd9d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'eBay seller and buyer specialists with platform expertise',
            'Secure packaging and handling for fragile items',
            'Proof of delivery and tracking integration',
            'Insurance coverage for valuable items',
            'Flexible pickup and delivery scheduling'
        ],
        process: [
            { step: 1, title: 'Booking', description: 'Book delivery service with eBay item details and requirements' },
            { step: 2, title: 'Pickup', description: 'Professional pickup with careful handling and documentation' },
            { step: 3, title: 'Packaging', description: 'Secure packaging and protection for safe transport' },
            { step: 4, title: 'Delivery', description: 'Timely delivery with proof of delivery documentation' },
            { step: 5, title: 'Confirmation', description: 'Delivery confirmation sent to both buyer and seller' }
        ],
        faq: [
            { question: 'Do you integrate with eBay?', answer: 'Yes, we provide seamless integration with eBay for tracking and delivery confirmation.' },
            { question: 'What if the buyer is not home?', answer: 'We offer flexible delivery options including safe place delivery and rescheduling.' },
            { question: 'Do you provide proof of delivery?', answer: 'Yes, we provide photo proof of delivery and signature confirmation.' },
            { question: 'What about fragile items?', answer: 'We offer specialized packaging and handling for fragile and valuable items.' }
        ],
        stats: {
            ebayDeliveries: '15,000+',
            averageRating: '4.7',
            satisfactionRate: '97%',
            successfulDeliveries: '99%'
        }
    },
    {
        id: 'gumtree-delivery',
        title: 'Gumtree Delivery',
        description: 'Connect local buyers and sellers with our reliable Gumtree delivery service that makes local marketplace transactions effortless and secure. We understand the local nature of Gumtree transactions and provide tailored delivery solutions that work for both parties. From small items to large furniture, our local expertise ensures timely delivery within your area, with flexible scheduling options and professional handling that builds trust between buyers and sellers in the local community.',
        category: 'Man & Van Services',
        icon: IconPackageImport,
        features: ['Local delivery', 'Secure handling', 'Proof of delivery', 'Insurance coverage', 'Flexible scheduling'],
        image: 'https://images.unsplash.com/photo-1567570670849-79db9c45cd9d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Custom Quote',
        duration: 'Varies',
        popular: false,
        subtitle: 'Reliable delivery services for Gumtree marketplace transactions',
        gallery: [
            'https://images.unsplash.com/photo-1586864387789-628af9feed72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1567570670849-79db9c45cd9d?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Local delivery specialists with area knowledge',
            'Secure handling and transport of items',
            'Proof of delivery and tracking services',
            'Insurance coverage for peace of mind',
            'Flexible scheduling to suit both parties'
        ],
        process: [
            { step: 1, title: 'Booking', description: 'Arrange delivery service with pickup and delivery details' },
            { step: 2, title: 'Pickup', description: 'Professional pickup with item inspection and documentation' },
            { step: 3, title: 'Transport', description: 'Secure transport with careful handling and protection' },
            { step: 4, title: 'Delivery', description: 'Timely delivery with proof of delivery documentation' },
            { step: 5, title: 'Completion', description: 'Delivery confirmation and payment processing' }
        ],
        faq: [
            { question: 'Do you handle large items?', answer: 'Yes, we can handle large items including furniture, appliances, and bulky goods.' },
            { question: 'What if the buyer is not available?', answer: 'We offer flexible delivery options and can reschedule if needed.' },
            { question: 'Do you provide proof of delivery?', answer: 'Yes, we provide photo proof of delivery and signature confirmation.' },
            { question: 'What areas do you cover?', answer: 'We provide local delivery services in major cities and surrounding areas.' }
        ],
        stats: {
            gumtreeDeliveries: '8,000+',
            averageRating: '4.5',
            satisfactionRate: '94%',
            localCoverage: '50+ cities'
        }
    },
    {
        id: 'heavy-large-item-delivery',
        title: 'Heavy & Large Item Delivery',
        description: 'Conquer the challenge of moving heavy and oversized items with our specialized delivery service designed for items that require extra care and expertise. We understand that large appliances, machinery, and bulky furniture present unique logistical challenges that standard delivery services can\'t handle. Our team of specialists uses purpose-built equipment, including dollies, hoists, and ramps, to safely transport your heavy items while navigating access challenges like stairs, narrow corridors, and difficult entry points.',
        category: 'Man & Van Services',
        icon: IconArrowsMaximize,
        features: ['Specialized equipment', 'Professional handling', 'Insurance coverage', 'Door-to-door service', 'Expert team'],
        image: 'https://images.unsplash.com/photo-1658483497480-9dd13cd5de15?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Custom Quote',
        duration: 'Varies',
        popular: false,
        subtitle: 'Expert handling of heavy and oversized items with specialized equipment',
        gallery: [
            'https://images.unsplash.com/photo-1586864387789-628af9feed72?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1658483497480-9dd13cd5de15?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Specialized equipment for heavy and oversized items',
            'Experienced team with heavy lifting expertise',
            'Comprehensive insurance coverage for valuable items',
            'Door-to-door service with careful handling',
            'Professional assessment and planning for each move'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Evaluate item size, weight, and access requirements' },
            { step: 2, title: 'Planning', description: 'Create detailed plan with specialized equipment needs' },
            { step: 3, title: 'Preparation', description: 'Prepare equipment and protective materials' },
            { step: 4, title: 'Transport', description: 'Careful loading and secure transport with monitoring' },
            { step: 5, title: 'Delivery', description: 'Professional unloading and placement at destination' }
        ],
        faq: [
            { question: 'What types of heavy items can you handle?', answer: 'We handle appliances, machinery, large furniture, safes, and other heavy or oversized items.' },
            { question: 'Do you have specialized equipment?', answer: 'Yes, we use dollies, hoists, ramps, and other specialized equipment for heavy items.' },
            { question: 'What about access issues?', answer: 'We assess access requirements and can handle stairs, narrow corridors, and difficult access points.' },
            { question: 'Is insurance included?', answer: 'Yes, comprehensive insurance coverage is included for all heavy item deliveries.' }
        ],
        stats: {
            heavyItemsMoved: '3,000+',
            averageRating: '4.8',
            satisfactionRate: '98%',
            insuranceCoverage: '£50,000'
        }
    },
    {
        id: 'specialist-antiques-delivery',
        title: 'Specialist & Antiques Delivery',
        description: 'Preserve the beauty and value of your precious antiques and delicate items with our white glove delivery service that treats every piece as a priceless treasure. Our specialist handlers combine decades of experience with cutting-edge technology to ensure your valuable items receive the care they deserve. From climate-controlled transport to specialized packaging materials, we create the perfect environment for fragile items, ensuring they arrive at their destination in the same pristine condition as when they left.',
        category: 'Man & Van Services',
        icon: IconGlass,
        features: ['Expert handling', 'Climate control', 'Insurance coverage', 'Specialized packaging', 'White glove service'],
        image: 'https://images.unsplash.com/photo-1617048213128-d2265ab51303?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        heroImage: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Custom Quote',
        duration: 'Varies',
        popular: false,
        subtitle: 'White glove service for valuable antiques and delicate items',
        gallery: [
            'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1617048213128-d2265ab51303?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Specialist handlers with antiques and fine art expertise',
            'Climate-controlled transport for sensitive items',
            'White glove service with extreme care and attention',
            'Comprehensive insurance coverage for valuable items',
            'Specialized packaging and protective materials'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Detailed assessment of item condition and special requirements' },
            { step: 2, title: 'Packaging', description: 'Specialized packaging with protective materials and climate control' },
            { step: 3, title: 'Transport', description: 'Climate-controlled transport with constant monitoring' },
            { step: 4, title: 'Delivery', description: 'White glove delivery with careful handling and placement' },
            { step: 5, title: 'Inspection', description: 'Post-delivery inspection to ensure item condition' }
        ],
        faq: [
            { question: 'What types of antiques do you handle?', answer: 'We handle all types of antiques including furniture, artwork, ceramics, glassware, and other valuable items.' },
            { question: 'Do you provide climate control?', answer: 'Yes, we offer climate-controlled transport to protect sensitive items from temperature and humidity changes.' },
            { question: 'What insurance coverage do you provide?', answer: 'We provide comprehensive insurance coverage specifically designed for valuable antiques and collectibles.' },
            { question: 'Do you offer white glove service?', answer: 'Yes, our white glove service includes careful handling, specialized packaging, and professional placement.' }
        ],
        stats: {
            antiquesDelivered: '1,500+',
            averageRating: '4.9',
            satisfactionRate: '99%',
            insuranceCoverage: '£100,000'
        }
    },
    // Vehicle Delivery
    {
        id: 'car-transport',
        title: 'Car Transport',
        description: 'Protect your valuable vehicle investment with our professional car transport service that combines security, reliability, and peace of mind. Whether you\'re relocating, purchasing a vehicle from afar, or need to transport a classic car, our specialized service ensures your vehicle arrives at its destination in perfect condition. With enclosed and open trailer options, real-time GPS tracking, and comprehensive insurance coverage, we provide the ultimate protection for your vehicle while offering transparent communication throughout the entire transport process.',
        category: 'Vehicle Delivery',
        icon: IconCar,
        features: ['Enclosed transport available', 'Door-to-door delivery', 'Insurance coverage', 'Real-time tracking', 'Professional drivers'],
        image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Custom Quote',
        duration: 'Varies',
        popular: false,
        subtitle: 'Professional car transport with enclosed trailers and comprehensive insurance',
        gallery: [
            'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1563720223523-499a02716184?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Licensed and insured car transport specialists',
            'Enclosed and open trailer options available',
            'Real-time GPS tracking throughout transport',
            'Comprehensive insurance coverage up to £100,000',
            'Professional drivers with HGV licenses'
        ],
        process: [
            { step: 1, title: 'Quote', description: 'Get a detailed quote based on vehicle type and distance' },
            { step: 2, title: 'Booking', description: 'Schedule pickup and delivery dates with flexible options' },
            { step: 3, title: 'Pickup', description: 'Professional pickup with vehicle inspection and documentation' },
            { step: 4, title: 'Transport', description: 'Secure transport with real-time tracking updates' },
            { step: 5, title: 'Delivery', description: 'Door-to-door delivery with final inspection' }
        ],
        faq: [
            { question: 'Do you offer enclosed transport?', answer: 'Yes, we offer both enclosed and open trailer options depending on your vehicle and preferences.' },
            { question: 'How do you track my vehicle?', answer: 'We provide real-time GPS tracking so you can monitor your vehicle throughout the journey.' },
            { question: 'What insurance coverage do you provide?', answer: 'We provide comprehensive insurance coverage up to £100,000 for vehicle damage during transport.' },
            { question: 'How long does car transport take?', answer: 'Transport times vary by distance: 1-3 days for UK transport, 1-2 weeks for international.' }
        ],
        stats: {
            vehiclesTransported: '8,000+',
            averageRating: '4.8',
            satisfactionRate: '98%',
            insuranceCoverage: '£100,000'
        }
    },
    {
        id: 'motorcycle-transport',
        title: 'Motorcycle Transport',
        description: 'Safeguard your prized motorcycle with our specialized transport service that understands the unique requirements of two-wheeled vehicles. Our motorcycle transport specialists use industry-leading securing techniques and equipment to ensure your bike arrives at its destination in pristine condition. From sport bikes to cruisers, we provide enclosed transport options that protect against weather and road debris, while our professional securing methods prevent any movement or damage during transit, giving you complete confidence in the safety of your motorcycle.',
        category: 'Vehicle Delivery',
        icon: IconMotorbike,
        features: ['Enclosed transport', 'Professional securing', 'Insurance coverage', 'Real-time tracking', 'Expert handling'],
        image: 'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        heroImage: 'https://images.unsplash.com/photo-1563720223523-499a02716184?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
        price: 'Custom Quote',
        duration: 'Varies',
        popular: false,
        subtitle: 'Professional motorcycle transport with specialized securing and protection',
        gallery: [
            'https://images.unsplash.com/photo-1563720223523-499a02716184?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1511918984145-48de785d4c4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        ],
        whyChooseUs: [
            'Motorcycle transport specialists with years of experience',
            'Enclosed transport to protect from weather and road debris',
            'Professional securing with specialized straps and equipment',
            'Comprehensive insurance coverage for motorcycles',
            'Real-time tracking throughout the transport journey'
        ],
        process: [
            { step: 1, title: 'Assessment', description: 'Evaluate motorcycle type, size, and transport requirements' },
            { step: 2, title: 'Booking', description: 'Schedule transport with flexible pickup and delivery options' },
            { step: 3, title: 'Pickup', description: 'Professional pickup with careful loading and securing' },
            { step: 4, title: 'Transport', description: 'Secure transport with real-time tracking and monitoring' },
            { step: 5, title: 'Delivery', description: 'Careful unloading and delivery with condition verification' }
        ],
        faq: [
            { question: 'Do you offer enclosed transport?', answer: 'Yes, we offer enclosed transport to protect your motorcycle from weather and road debris.' },
            { question: 'How do you secure motorcycles?', answer: 'We use specialized straps, wheel chocks, and securing equipment designed specifically for motorcycles.' },
            { question: 'What insurance coverage do you provide?', answer: 'We provide comprehensive insurance coverage specifically for motorcycle transport.' },
            { question: 'Can you transport multiple motorcycles?', answer: 'Yes, we can transport multiple motorcycles in a single shipment with proper spacing and securing.' }
        ],
        stats: {
            motorcyclesTransported: '2,000+',
            averageRating: '4.8',
            satisfactionRate: '98%',
            insuranceCoverage: '£50,000'
        }
    },
];

export function getServiceDetailById(id: string) {
    return serviceDetails.find(s => s.id === id);
} 

export function getAllowedCategoriesByServiceTitle(serviceTitle: string): string[] {
    switch (serviceTitle) {
        case 'Furniture & Appliance Delivery':
            return ['Furniture', 'Appliances'];
        case 'Piano Delivery':
            return ['musical'];
        case 'Parcel Delivery':
        case 'eBay Delivery':
        case 'Gumtree Delivery':
            return ['Parcels'];
        case 'Heavy & Large Item Delivery':
            return ['Large Items', 'Appliances'];
        case 'Specialist & Antiques Delivery':
            return ['Antiques'];
        case 'Car Transport':
            return ['Cars'];
        case 'Motorcycle Transport':
            return ['Motorcycles'];
        default:
            return [];
    }
}