'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faCheckCircle, faRecycle, faLeaf, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { ForgetPassword } from '../../store/authSlice';
import { RootState } from '../../store/store';
import { AppDispatch } from '../../store';

export default function ForgotPassword() {
	const [email, setEmail] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);
	
	const dispatch = useDispatch<AppDispatch>();
	const { loading, error } = useSelector((state: RootState) => state.auth);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		try {
			const resultAction = await dispatch(ForgetPassword({ email })).unwrap();
			
			if (resultAction) {
				setIsSubmitted(true);
			}
		} catch (error) {
			console.error('Password reset error:', error);
		}
	};

	return (
		<div className="min-h-screen relative flex overflow-hidden">
			{/* Left Side - Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
				<motion.div 
					initial={{ opacity: 0, x: -50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md"
				>
					{/* Back to Home */}
					<Link 
						to="/" 
						className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 mb-8 transition-colors"
					>
						<FontAwesomeIcon icon={faArrowLeft} />
						<span>Back to Home</span>
					</Link>

					{/* Logo */}
					<div className="flex items-center gap-3 mb-8">
						<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
							<FontAwesomeIcon icon={faRecycle} className="text-white text-xl" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Wasgo</h1>
							<p className="text-xs text-gray-600">Smart Waste Management</p>
						</div>
					</div>

					{/* Title */}
					<div className="mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
						<p className="text-gray-600">Enter your email and we'll send you a secure reset link</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
								</div>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all border-gray-300"
									placeholder="your.email@example.com"
								/>
							</div>
						</div>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							type="submit"
							disabled={loading || !email}
							className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? 'Sending reset link...' : 'Send Reset Link'}
						</motion.button>

						{error && (
							<motion.p 
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-red-500 text-sm"
							>
								{error}
							</motion.p>
						)}
					</form>

					{/* Back to login */}
					<p className="text-center mt-8 text-gray-600">
						Remembered your password?{' '}
						<Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
							Back to Sign In
						</Link>
					</p>

					{/* Success state */}
					<AnimatePresence>
						{isSubmitted && (
							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
								<div className="flex items-center gap-3">
									<FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
									<span>Reset link sent to {email}. Check your inbox.</span>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>

			{/* Right Side - Visual */}
			<div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700"></div>
				<div className="absolute inset-0">
					<motion.div
						animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
						transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
						className="absolute top-20 left-20 w-64 h-64 bg-green-400 rounded-full blur-3xl opacity-20"
					/>
					<motion.div
						animate={{ scale: [1, 1.3, 1], rotate: [360, 180, 0] }}
						transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
						className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400 rounded-full blur-3xl opacity-20"
					/>
				</div>
				<div className="absolute inset-0 overflow-hidden">
					<motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/4 left-1/4 text-white/20">
						<FontAwesomeIcon icon={faRecycle} size="4x" />
					</motion.div>
					<motion.div animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-1/3 right-1/4 text-white/20">
						<FontAwesomeIcon icon={faLeaf} size="3x" />
					</motion.div>
					<motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute top-1/2 right-1/3 text-white/15">
						<FontAwesomeIcon icon={faGlobe} size="5x" />
					</motion.div>
				</div>
				<div className="relative z-10 h-full flex items-center justify-center p-12">
					<div className="text-center text-white max-w-md">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
							<h2 className="text-4xl font-bold mb-6">Stay Secure</h2>
							<p className="text-xl text-green-100 mb-8">We help keep your account safe while you keep the planet clean.</p>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
