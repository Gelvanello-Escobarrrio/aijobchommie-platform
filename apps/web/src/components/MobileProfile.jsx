import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiCamera,
  FiSave, FiX, FiBriefcase, FiBook, FiAward,
  FiSettings, FiLogOut, FiEye, FiEyeOff, FiLock,
  FiUpload, FiFileText, FiStar, FiTarget
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MobileProfile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    experience: '',
    education: '',
    skills: [],
    languages: [],
    profileImage: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        title: user.title || '',
        bio: user.bio || '',
        experience: user.experience || '',
        education: user.education || '',
        skills: user.skills || [],
        languages: user.languages || [],
        profileImage: user.profile_image || null
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData({ ...profileData, profileImage: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, skill]
      });
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const ProfileHeader = () => (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-4 pt-8 pb-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-white overflow-hidden">
            {profileData.profileImage ? (
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <FiUser className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          
          {editing && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowImagePicker(true)}
              className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-2 rounded-full shadow-lg"
            >
              <FiCamera className="w-3 h-3" />
            </motion.button>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-white text-xl font-bold">{profileData.name}</h2>
          <p className="text-blue-100 text-sm">{profileData.title || 'Job Seeker'}</p>
          <p className="text-blue-200 text-xs flex items-center mt-1">
            <FiMapPin className="w-3 h-3 mr-1" />
            {profileData.location || 'Location not set'}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => editing ? handleSaveProfile() : setEditing(true)}
          disabled={loading}
          className="bg-white bg-opacity-20 text-white p-3 rounded-full"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : editing ? (
            <FiSave className="w-4 h-4" />
          ) : (
            <FiEdit3 className="w-4 h-4" />
          )}
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 bg-white bg-opacity-10 rounded-xl p-4">
        <div className="text-center">
          <p className="text-white text-lg font-bold">12</p>
          <p className="text-blue-100 text-xs">Applications</p>
        </div>
        <div className="text-center">
          <p className="text-white text-lg font-bold">85%</p>
          <p className="text-blue-100 text-xs">Profile Match</p>
        </div>
        <div className="text-center">
          <p className="text-white text-lg font-bold">5</p>
          <p className="text-blue-100 text-xs">Saved Jobs</p>
        </div>
      </div>
    </div>
  );

  const TabNavigation = () => (
    <div className="bg-white shadow-sm px-4">
      <div className="flex space-x-1">
        {[
          { id: 'profile', label: 'Profile', icon: FiUser },
          { id: 'experience', label: 'Experience', icon: FiBriefcase },
          { id: 'settings', label: 'Settings', icon: FiSettings }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center space-x-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const InputField = ({ label, value, onChange, type = 'text', multiline = false, placeholder, icon: Icon, disabled = false }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        )}
        {multiline ? (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled || !editing}
            rows={4}
            className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none ${
              !editing ? 'bg-gray-50 text-gray-600' : ''
            }`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled || !editing}
            className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 ${
              !editing ? 'bg-gray-50 text-gray-600' : ''
            }`}
          />
        )}
      </div>
    </div>
  );

  const SkillsSection = () => {
    const [newSkill, setNewSkill] = useState('');

    return (
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          Skills
        </label>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {profileData.skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              <span>{skill}</span>
              {editing && (
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <FiX className="w-3 h-3" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {editing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addSkill(newSkill);
                  setNewSkill('');
                }
              }}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                addSkill(newSkill);
                setNewSkill('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
            >
              Add
            </motion.button>
          </div>
        )}
      </div>
    );
  };

  const ProfileTab = () => (
    <div className="p-4 space-y-6">
      <InputField
        label="Full Name"
        value={profileData.name}
        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
        placeholder="Enter your full name"
        icon={FiUser}
      />

      <InputField
        label="Email Address"
        value={profileData.email}
        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
        type="email"
        placeholder="Enter your email"
        icon={FiMail}
        disabled={true}
      />

      <InputField
        label="Phone Number"
        value={profileData.phone}
        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
        type="tel"
        placeholder="Enter your phone number"
        icon={FiPhone}
      />

      <InputField
        label="Location"
        value={profileData.location}
        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
        placeholder="Enter your location"
        icon={FiMapPin}
      />

      <InputField
        label="Job Title"
        value={profileData.title}
        onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
        placeholder="Enter your current or desired job title"
        icon={FiBriefcase}
      />

      <InputField
        label="Bio"
        value={profileData.bio}
        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
        multiline={true}
        placeholder="Tell us about yourself..."
      />

      <SkillsSection />
    </div>
  );

  const ExperienceTab = () => (
    <div className="p-4 space-y-6">
      <InputField
        label="Work Experience"
        value={profileData.experience}
        onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
        multiline={true}
        placeholder="Describe your work experience..."
        icon={FiBriefcase}
      />

      <InputField
        label="Education"
        value={profileData.education}
        onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
        multiline={true}
        placeholder="Describe your educational background..."
        icon={FiBook}
      />

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-4">
          CV/Resume
        </label>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center space-y-2 text-gray-500"
        >
          <FiUpload className="w-8 h-8" />
          <span>Upload your CV/Resume</span>
          <span className="text-xs">PDF, DOC, DOCX (Max 5MB)</span>
        </motion.button>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-medium mb-4">
          Portfolio/Projects
        </label>
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center space-y-2 text-gray-500"
        >
          <FiFileText className="w-8 h-8" />
          <span>Add Portfolio Links</span>
          <span className="text-xs">Showcase your work</span>
        </motion.button>
      </div>
    </div>
  );

  const SettingsTab = () => (
    <div className="p-4 space-y-4">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowPasswordModal(true)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiLock className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Change Password</h3>
            <p className="text-sm text-gray-500">Update your account password</p>
          </div>
        </div>
        <FiEdit3 className="w-5 h-5 text-gray-400" />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiStar className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Privacy Settings</h3>
            <p className="text-sm text-gray-500">Control your profile visibility</p>
          </div>
        </div>
        <FiEdit3 className="w-5 h-5 text-gray-400" />
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiTarget className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">Notification Preferences</h3>
            <p className="text-sm text-gray-500">Manage your alerts and updates</p>
          </div>
        </div>
        <FiEdit3 className="w-5 h-5 text-gray-400" />
      </motion.button>

      <div className="pt-6 border-t border-gray-200">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="w-full flex items-center justify-center space-x-3 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </motion.button>
      </div>
    </div>
  );

  const PasswordModal = () => (
    <AnimatePresence>
      {showPasswordModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPasswordModal(false)}
                className="p-2 rounded-full bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.current ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {loading ? 'Changing...' : 'Change Password'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ImagePickerModal = () => (
    <AnimatePresence>
      {showImagePicker && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end"
          onClick={() => setShowImagePicker(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white w-full rounded-t-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Update Profile Photo</h3>
              <p className="text-gray-600 text-sm">Choose how you'd like to update your photo</p>
            </div>

            <div className="space-y-3">
              <label htmlFor="camera-input">
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-50 rounded-xl cursor-pointer"
                >
                  <FiCamera className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-600">Take Photo</span>
                </motion.div>
              </label>
              <input
                id="camera-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />

              <label htmlFor="gallery-input">
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-3 p-4 bg-green-50 rounded-xl cursor-pointer"
                >
                  <FiUpload className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-600">Choose from Gallery</span>
                </motion.div>
              </label>
              <input
                id="gallery-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowImagePicker(false)}
                className="w-full p-4 bg-gray-100 rounded-xl text-gray-700 font-medium"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      <TabNavigation />

      <div className="min-h-[60vh]">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'experience' && <ExperienceTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      <PasswordModal />
      <ImagePickerModal />

      {editing && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setEditing(false)}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700"
            >
              Cancel
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveProfile}
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileProfile;
