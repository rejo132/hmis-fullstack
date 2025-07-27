
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchCommunicationSettings, addCommunication, toggleCommunicationSetting } from '../slices/communicationSettingsSlice';

const CommunicationSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, access_token } = useSelector((state) => state.auth);
  const { settings, status, error } = useSelector((state) => state.communicationSettings);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.role === 'Admin') {
      dispatch(fetchCommunicationSettings());
    } else {
      navigate('/dashboard');
      toast.error('Unauthorized access');
    }
  }, [user, dispatch, navigate]);

  useEffect(() => {
    if (error) toast.error(`Failed to load settings: ${error}`);
    else if (settings && status === 'succeeded') toast.success('Communication Settings Loaded');
  }, [error, settings, status]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        addCommunication({
          message,
          type: settings.sms ? 'sms' : settings.email ? 'email' : 'chat',
          token: access_token,
        })
      ).unwrap();
      toast.success('Message Sent');
      setMessage('');
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error(`Failed to send message: ${err}`);
    }
  };

  const handleToggle = async (setting) => {
    try {
      await dispatch(toggleCommunicationSetting({ setting, token: access_token })).unwrap();
      toast.success(`${setting} setting updated`);
    } catch (err) {
      toast.error(`Failed to update ${setting}: ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Communication Settings</h2>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="card mb-8">
        <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="sms"
              checked={settings.sms || false}
              onChange={() => handleToggle('sms')}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={status === 'loading'}
            />
            <label htmlFor="sms" className="ml-3 text-gray-700">
              Enable SMS Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email"
              checked={settings.email || false}
              onChange={() => handleToggle('email')}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={status === 'loading'}
            />
            <label htmlFor="email" className="ml-3 text-gray-700">
              Enable Email Notifications
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="chat"
              checked={settings.chat || false}
              onChange={() => handleToggle('chat')}
              className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              disabled={status === 'loading'}
            />
            <label htmlFor="chat" className="ml-3 text-gray-700">
              Enable Internal Chat
            </label>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Send Message</h3>
        <form onSubmit={handleSendMessage}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-field"
              rows="4"
              required
            />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="btn-primary flex-1" disabled={status === 'loading'}>
              Send
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex-1"
              disabled={status === 'loading'}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunicationSettings;
