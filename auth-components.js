// Main Auth App Component
function AuthApp() {
    const [activeModal, setActiveModal] = useState(null);
    
    // Expose modal functions to window for external access
    React.useEffect(() => {
      window.openSignInModal = () => setActiveModal('signin');
      window.openSignUpModal = () => setActiveModal('signup');
      window.openForgotPasswordModal = () => setActiveModal('forgot');
      window.closeModal = () => setActiveModal(null);
      
      // Clean up
      return () => {
        window.openSignInModal = undefined;
        window.openSignUpModal = undefined;
        window.openForgotPasswordModal = undefined;
        window.closeModal = undefined;
      };
    }, []);
    
    // Close modal when clicking outside
    const handleOutsideClick = (e) => {
      if (e.target.classList.contains('auth-modal')) {
        setActiveModal(null);
      }
    };
    
    return (
      <>
        {/* Sign In Modal */}
        <div 
          className="auth-modal" 
          style={{ display: activeModal === 'signin' ? 'flex' : 'none' }}
          onClick={handleOutsideClick}
        >
          <div className="auth-modal-content">
            <span className="close-modal" onClick={() => setActiveModal(null)}>&times;</span>
            <SignInForm 
              onForgotPassword={() => setActiveModal('forgot')}
              onSignUp={() => setActiveModal('signup')}
            />
          </div>
        </div>
        
        {/* Sign Up Modal */}
        <div 
          className="auth-modal" 
          style={{ display: activeModal === 'signup' ? 'flex' : 'none' }}
          onClick={handleOutsideClick}
        >
          <div className="auth-modal-content">
            <span className="close-modal" onClick={() => setActiveModal(null)}>&times;</span>
            <SignUpForm onSignIn={() => setActiveModal('signin')} />
          </div>
        </div>
        
        {/* Forgot Password Modal */}
        <div 
          className="auth-modal" 
          style={{ display: activeModal === 'forgot' ? 'flex' : 'none' }}
          onClick={handleOutsideClick}
        >
          <div className="auth-modal-content">
            <span className="close-modal" onClick={() => setActiveModal(null)}>&times;</span>
            <ForgotPasswordForm onSignIn={() => setActiveModal('signin')} />
          </div>
        </div>
      </>
    );
  }
  
  // Sign In Form Component
  function SignInForm({ onForgotPassword, onSignUp }) {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    };
    
    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Handle successful login
        console.log('Login successful', formData);
        
        // Redirect or update UI as needed
        window.location.href = '/dashboard'; // Example redirect
      } catch (error) {
        setErrors({
          form: 'Invalid email or password'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      <div className="auth-container">
        <div className="auth-logo">
          <h1>Eventoria</h1>
        </div>
        <div className="auth-title">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your account</p>
        </div>
        
        {errors.form && <div className="auth-error">{errors.form}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email" 
              className={errors.email ? "error" : ""}
            />
            {errors.email && <div className="input-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password" 
              className={errors.password ? "error" : ""}
            />
            {errors.password && <div className="input-error">{errors.password}</div>}
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input 
                type="checkbox" 
                id="rememberMe" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="#" className="forgot-password" onClick={(e) => {
              e.preventDefault();
              onForgotPassword();
            }}>
              Forgot Password?
            </a>
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div className="social-divider">
          <span>Or sign in with</span>
        </div>
        
        <div className="social-login">
          <a href="#" className="social-btn facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-btn google">
            <i className="fab fa-google"></i>
          </a>
          <a href="#" className="social-btn twitter">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <a href="#" onClick={(e) => {
              e.preventDefault();
              onSignUp();
            }}>
              Sign Up
            </a>
          </p>
        </div>
      </div>
    );
  }
  
  // Sign Up Form Component
  function SignUpForm({ onSignIn }) {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
      
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    };
    
    const validateForm = () => {
      const newErrors = {};
      
      if (!formData.name) {
        newErrors.name = 'Full name is required';
      }
      
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = 'You must agree to the terms and conditions';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Handle successful registration
        console.log('Registration successful', formData);
        
        // Redirect to sign in
        onSignIn();
      } catch (error) {
        setErrors({
          form: 'An error occurred during registration. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    return (
      <div className="auth-container">
        <div className="auth-logo">
          <h1>Eventoria</h1>
        </div>
        <div className="auth-title">
          <h2>Create Account</h2>
          <p>Sign up to get started with Eventoria</p>
        </div>
        
        {errors.form && <div className="auth-error">{errors.form}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name" 
              className={errors.name ? "error" : ""}
            />
            {errors.name && <div className="input-error">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email" 
              className={errors.email ? "error" : ""}
            />
            {errors.email && <div className="input-error">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password" 
              className={errors.password ? "error" : ""}
            />
            {errors.password && <div className="input-error">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password" 
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && <div className="input-error">{errors.confirmPassword}</div>}
          </div>
          
          <div className="form-check">
            <input 
              type="checkbox" 
              id="agreeTerms" 
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={errors.agreeTerms ? "error" : ""}
            />
            <label htmlFor="agreeTerms">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>
          {errors.agreeTerms && <div className="input-error">{errors.agreeTerms}</div>}
          
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        
        <div className="social-divider">
          <span>Or sign up with</span>
        </div>
        
        <div className="social-login">
          <a href="#" className="social-btn facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="social-btn google">
            <i className="fab fa-google"></i>
          </a>
          <a href="#" className="social-btn twitter">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
        
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <a href="#" onClick={(e) => {
              e.preventDefault();
              onSignIn();
            }}>
              Sign In
            </a>
          </p>
        </div>
      </div>
    );
  }
  
  // Forgot Password Form Component
  function ForgotPasswordForm({ onSignIn }) {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const handleChange = (e) => {
      setEmail(e.target.value);
      
      // Clear error when user starts typing
      if (errors.email) {
        setErrors({});
      }
    };
    
    const validateForm = () => {
      const newErrors = {};
      
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = 'Email is invalid';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Handle successful password reset request
        console.log('Password reset email sent to', email);
        setIsSubmitted(true);
      } catch (error) {
        setErrors({
          form: 'An error occurred. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    const handleResend = () => {
      handleSubmit({ preventDefault: () => {} });
    };
    
    return (
      <div className="auth-container">
        <div className="auth-logo">
          <h1>Eventoria</h1>
        </div>
        <div className="auth-title">
          <h2>Forgot Password</h2>
          <p>Enter your email to reset your password</p>
        </div>
        
        {isSubmitted ? (
          <div className="auth-success">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2>Check Your Email</h2>
            <p>
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <p className="small-text">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                type="button"
                className="resend-link"
                onClick={handleResend}
              >
                click here to resend
              </button>
            </p>
            <button 
              className="btn btn-primary auth-btn"
              onClick={() => onSignIn()}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {errors.form && <div className="auth-error">{errors.form}</div>}
            
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="reset-email">Email Address</label>
                <input 
                  type="email" 
                  id="reset-email" 
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email" 
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <div className="input-error">{errors.email}</div>}
              </div>
              
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Sending..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
        
        <div className="auth-footer">
          <p>
            Remember your password?{" "}
            <a href="#" onClick={(e) => {
              e.preventDefault();
              onSignIn();
            }}>
              Back to Sign In
            </a>
          </p>
        </div>
      </div>
    );
  }