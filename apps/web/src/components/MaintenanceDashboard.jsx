import React, { useState } from 'react';
import { 
  getAllMaintenanceStatus, 
  QUICK_MODES, 
  getMaintenanceInfo 
} from '../config/maintenanceMode';
import NeonEmoji from './NeonEmoji';

const MaintenanceDashboard = ({ isAdmin = false }) => {
  const [maintenanceStatus] = useState(getAllMaintenanceStatus());
  const [selectedMode, setSelectedMode] = useState('');

  const getStatusColor = (enabled) => {
    return enabled ? 'var(--accent-lime)' : 'var(--neon-orange)';
  };

  const getStatusIcon = (enabled) => {
    return enabled ? '✅' : '⏳';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleQuickModeSelect = (modeName) => {
    setSelectedMode(modeName);
    // In a real implementation, this would make an API call to update the configuration
    console.log('Quick mode selected:', modeName, QUICK_MODES[modeName]);
  };

  return (
    <div style={{ padding: 'var(--space-lg)', background: 'var(--bg-secondary)', borderRadius: '15px', margin: 'var(--space-lg) 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <NeonEmoji type="gear" size={32} color="cyan" intensity="high" />
          <h2 style={{ color: 'var(--primary-cyan)', margin: 0 }}>Platform Status Dashboard</h2>
          <NeonEmoji type="gear" size={32} color="cyan" intensity="high" />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Monitor compliance status and feature availability
        </p>
      </div>

      {/* Department of Labour Registration Status */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)', border: '2px solid var(--neon-orange)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <NeonEmoji type="shield" size={24} color="orange" intensity="high" />
          <h3 style={{ color: 'var(--neon-orange)', margin: 0 }}>Department of Labour Compliance</h3>
        </div>
        <div className="grid grid-2" style={{ gap: 'var(--space-lg)' }}>
          <div>
            <h4 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-sm)' }}>TEA Registration Status</h4>
            <div style={{ background: 'rgba(255, 107, 0, 0.1)', padding: 'var(--space-md)', borderRadius: '10px', marginBottom: 'var(--space-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                <span style={{ color: 'var(--neon-orange)' }}>⏳</span>
                <span style={{ fontWeight: 'bold' }}>In Progress</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                Application submitted to Department of Labour
              </p>
            </div>
          </div>
          <div>
            <h4 style={{ color: 'var(--primary-magenta)', marginBottom: 'var(--space-sm)' }}>Expected Completion</h4>
            <div style={{ background: 'rgba(255, 0, 255, 0.1)', padding: 'var(--space-md)', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                <NeonEmoji type="calendar" size={16} color="magenta" intensity="medium" />
                <span style={{ fontWeight: 'bold', color: 'var(--primary-magenta)' }}>Q2 2024</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                Estimated completion date
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Status Grid */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
          Feature Availability Status
        </h3>
        <div className="grid grid-2" style={{ gap: 'var(--space-lg)' }}>
          {Object.entries(maintenanceStatus).map(([featureName, feature]) => {
            if (featureName === 'internal') return null;
            
            return (
              <div 
                key={featureName}
                className="card"
                style={{ 
                  border: `2px solid ${getStatusColor(feature.enabled)}`,
                  background: `linear-gradient(135deg, ${getStatusColor(feature.enabled)}10, transparent)`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                  <h4 style={{ color: getStatusColor(feature.enabled), margin: 0, textTransform: 'capitalize' }}>
                    {featureName.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <span style={{ fontSize: '1.5rem' }}>{getStatusIcon(feature.enabled)}</span>
                </div>
                
                <div style={{ marginBottom: 'var(--space-sm)' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Status: </strong>
                  <span style={{ color: getStatusColor(feature.enabled) }}>
                    {feature.enabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
                
                {feature.reason && (
                  <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Reason: </strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{feature.reason}</span>
                  </div>
                )}
                
                {feature.expectedDate && (
                  <div style={{ marginBottom: 'var(--space-sm)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Expected: </strong>
                    <span style={{ color: 'var(--text-secondary)' }}>{formatDate(feature.expectedDate)}</span>
                  </div>
                )}
                
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {feature.message}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Internal Systems Status */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <h3 style={{ color: 'var(--accent-lime)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
          <NeonEmoji type="checkmark" size={24} color="lime" intensity="high" />
          Internal Systems Status
        </h3>
        <div className="grid grid-3" style={{ gap: 'var(--space-lg)' }}>
          {Object.entries(maintenanceStatus.internal).map(([systemName, system]) => (
            <div 
              key={systemName}
              className="card"
              style={{ 
                border: '2px solid var(--accent-lime)',
                background: 'linear-gradient(135deg, rgba(0, 255, 0, 0.1), transparent)',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>
                <NeonEmoji 
                  type={systemName === 'scraping' ? 'robot' : systemName === 'analytics' ? 'chart' : 'api'} 
                  size={32} 
                  color="lime" 
                  intensity="high" 
                />
              </div>
              <h4 style={{ color: 'var(--accent-lime)', margin: '0 0 var(--space-sm)', textTransform: 'capitalize' }}>
                {systemName}
              </h4>
              <div style={{ color: 'var(--accent-lime)', fontWeight: 'bold', marginBottom: 'var(--space-xs)' }}>
                ✅ Operational
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                {system.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Mode Selector (Admin Only) */}
      {isAdmin && (
        <div className="card" style={{ border: '2px solid var(--neon-pink)' }}>
          <h3 style={{ color: 'var(--neon-pink)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
            <NeonEmoji type="settings" size={24} color="pink" intensity="high" />
            Quick Mode Configuration (Admin)
          </h3>
          <div className="grid grid-2" style={{ gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
            {Object.entries(QUICK_MODES).map(([modeName, mode]) => (
              <div
                key={modeName}
                className={`card ${selectedMode === modeName ? 'selected' : ''}`}
                style={{ 
                  cursor: 'pointer',
                  border: selectedMode === modeName ? '2px solid var(--neon-pink)' : '1px solid rgba(255,255,255,0.2)',
                  background: selectedMode === modeName ? 'rgba(255, 0, 255, 0.1)' : 'transparent'
                }}
                onClick={() => handleQuickModeSelect(modeName)}
              >
                <h4 style={{ 
                  color: selectedMode === modeName ? 'var(--neon-pink)' : 'var(--text-primary)', 
                  marginBottom: 'var(--space-sm)'
                }}>
                  {modeName.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {Object.entries(mode).map(([feature, config]) => (
                    <div key={feature} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                      <span style={{ textTransform: 'capitalize' }}>
                        {feature.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span style={{ color: config.enabled ? 'var(--accent-lime)' : 'var(--text-muted)' }}>
                        {config.enabled ? '✅' : '❌'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {selectedMode && (
            <div style={{ 
              background: 'rgba(255, 0, 255, 0.1)', 
              padding: 'var(--space-md)', 
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--neon-pink)', margin: '0 0 var(--space-sm)' }}>
                <strong>Selected Mode:</strong> {selectedMode.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <button 
                className="btn btn-primary"
                style={{ 
                  background: 'linear-gradient(45deg, var(--neon-pink), var(--neon-blue))',
                  fontSize: '0.9rem'
                }}
                onClick={() => {
                  // In real implementation, this would update the configuration
                  alert(`Quick mode "${selectedMode}" would be applied. See console for details.`);
                  console.log('Applying quick mode:', selectedMode, QUICK_MODES[selectedMode]);
                }}
              >
                Apply Configuration
              </button>
            </div>
          )}
        </div>
      )}

      {/* Action Items */}
      <div className="card" style={{ marginTop: 'var(--space-xl)', border: '2px solid var(--primary-cyan)' }}>
        <h3 style={{ color: 'var(--primary-cyan)', marginBottom: 'var(--space-lg)', textAlign: 'center' }}>
          Next Steps & Action Items
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ color: 'var(--neon-orange)' }}>📋</span>
            <span><strong>Complete TEA Registration:</strong> Submit all required documents to Department of Labour</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ color: 'var(--neon-orange)' }}>⚖️</span>
            <span><strong>Legal Compliance Review:</strong> Ensure all platform features comply with South African labour laws</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ color: 'var(--accent-lime)' }}>🔄</span>
            <span><strong>Monitor Scraping Operations:</strong> Ensure data collection remains active for platform preparation</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <span style={{ color: 'var(--primary-cyan)' }}>🎯</span>
            <span><strong>Prepare for Launch:</strong> Update feature flags when compliance is achieved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
