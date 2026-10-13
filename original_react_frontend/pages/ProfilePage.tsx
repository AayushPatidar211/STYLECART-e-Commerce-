import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Phone, MapPin, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { Address } from '../types';

interface ProfilePageProps {
  onNavigateToOrders: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigateToOrders }) => {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState<Address>({
    fullName: '',
    phone: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getProfile().then((p) => {
      setFirstName(p.firstName || '');
      setLastName(p.lastName || '');
      setPhoneNumber(p.phoneNumber || '');
      if (p.defaultAddress) {
        setAddress(p.defaultAddress);
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.updateProfile({
        firstName,
        lastName,
        phoneNumber,
        defaultAddress: address,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      alert('Failed to save profile changes');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <div className="pb-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">My Account</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Manage your personal profile, credentials, and default shipping addresses.
          </p>
        </div>

        <button
          onClick={onNavigateToOrders}
          className="text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View Past Orders</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Account badge */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 text-center md:text-left h-fit">
          <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-bold font-serif mx-auto md:mx-0">
            {firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 text-base">
              {firstName} {lastName}
            </h3>
            <p className="text-xs text-neutral-500 font-mono mt-0.5">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-semibold">
              <ShieldCheck className="w-3 h-3 text-neutral-600" />
              <span>{user?.role === 'ROLE_ADMIN' ? 'ROLE_ADMIN' : 'ROLE_USER'}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-500 space-y-2">
            <div className="flex justify-between">
              <span>Member Since</span>
              <span className="font-mono text-neutral-800">2026</span>
            </div>
            <div className="flex justify-between">
              <span>Security</span>
              <span className="text-emerald-700 font-medium">Stateless JWT</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Edit Form */}
        <form onSubmit={handleSave} className="md:col-span-2 bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 space-y-6">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile and delivery address updated successfully.</span>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-neutral-900 mb-4">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-neutral-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 0142"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider font-mono text-neutral-900 mb-4">
              Default Shipping Address
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.streetAddress}
                  onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                  placeholder="Street and house number"
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
