import { motion } from 'framer-motion';
import { Lock, Key, Fingerprint, ShieldCheck, Timer } from 'lucide-react';

// --- Reusable Components ---
const Section = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-bold text-white border-b border-[var(--color-blue)]/30 pb-2 mb-4 tracking-widest">
      {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const SecuritySetting = ({ icon: Icon, title, description, control }) => (
  <div className="flex items-center justify-between p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
    <div className="flex items-center gap-4">
      <Icon size={20} className="text-[var(--color-blue)]" />
      <div>
        <h4 className="font-bold text-white">{title}</h4>
        <p className="text-xs text-gray-500 font-mono">{description}</p>
      </div>
    </div>
    <div>{control}</div>
  </div>
);

const StatusIndicator = ({ text, color }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-xs font-bold text-gray-400">{text}</span>
  </div>
);

const ToggleSwitch = ({ enabled }) => (
  <div
    className={`w-10 h-5 flex items-center rounded-full px-1 cursor-pointer ${enabled ? 'bg-[var(--color-green)]' : 'bg-gray-700'}`}
  >
    <div
      className={`w-3 h-3 rounded-full bg-white transform transition-transform ${enabled ? 'translate-x-5' : ''}`}
    />
  </div>
);

export default function Security() {
  return (
    <motion.div
      key="security"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8"
    >
      <h2 className="text-2xl font-black text-[var(--color-yellow)] tracking-tighter">
        CYBERSECURITY & PRIVACY
      </h2>

      {/* Encryption & Data Protection */}
      <Section title="ENCRYPTION_&_DATA_PROTECTION">
        <SecuritySetting
          icon={Lock}
          title="End-to-End Encryption (E2EE)"
          description="Data is encrypted on your device before syncing."
          control={<StatusIndicator text="ACTIVE" color="bg-[var(--color-green)]" />}
        />
        <SecuritySetting
          icon={Key}
          title="Zero-Knowledge Architecture"
          description="Your encryption keys never leave your device."
          control={<StatusIndicator text="ENABLED" color="bg-[var(--color-green)]" />}
        />
        <SecuritySetting
          icon={Fingerprint}
          title="Biometric Authentication"
          description="Use Face ID or Touch ID for quick, secure access."
          control={<ToggleSwitch enabled={true} />}
        />
        <SecuritySetting
          icon={ShieldCheck}
          title="Two-Factor Authentication (2FA)"
          description="Secure your account with a TOTP authenticator."
          control={<ToggleSwitch enabled={false} />}
        />
        <SecuritySetting
          icon={Timer}
          title="Auto-Lock Timer"
          description="Automatically lock the app after a period of inactivity."
          control={
            <select className="bg-black border border-gray-700 text-xs p-2 text-white outline-none focus:border-[var(--color-blue)]">
              <option>5 minutes</option>
              <option>15 minutes</option>
              <option>30 minutes</option>
            </select>
          }
        />
      </Section>

      {/* Threat Detection */}
      <Section title="THREAT_DETECTION_&_ALERTS">
        <SecuritySetting
          icon={ShieldCheck}
          title="Real-time Threat Monitor"
          description="Actively scans for phishing links and malicious software."
          control={<StatusIndicator text="ACTIVE" color="bg-[var(--color-green)]" />}
        />
        <SecuritySetting
          icon={Timer}
          title="Suspicious Login Alerts"
          description="Notify on new device or unusual location logins."
          control={<ToggleSwitch enabled={true} />}
        />
        <SecuritySetting
          icon={Fingerprint}
          title="Location-based Security"
          description="Alerts for transactions far from your typical location."
          control={<ToggleSwitch enabled={true} />}
        />
        <SecuritySetting
          icon={Key}
          title="Data Breach Monitoring"
          description="Scans the dark web for compromised credentials."
          control={<StatusIndicator text="SCANNING..." color="bg-[var(--color-yellow)]" />}
        />
      </Section>

      {/* Privacy Features */}
      <Section title="PRIVACY_FEATURES">
        <SecuritySetting
          icon={ShieldCheck}
          title="Privacy Screen"
          description="Blurs app content when switching apps."
          control={<ToggleSwitch enabled={true} />}
        />
        <SecuritySetting
          icon={Key}
          title="Data Portability"
          description="Export your data to JSON or CSV."
          control={
            <button className="text-xs bg-[var(--color-blue)] hover:bg-[var(--color-blue)]/80 text-white font-bold py-2 px-3 rounded-md">
              EXPORT
            </button>
          }
        />
        <SecuritySetting
          icon={Timer}
          title="Delete Account"
          description="Permanently erase all your data."
          control={
            <button className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md">
              DELETE
            </button>
          }
        />
      </Section>
    </motion.div>
  );
}
