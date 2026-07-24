import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';
import toast from 'react-hot-toast';
import { contactAPI } from '../services/api.js';
import { ButtonLoader } from './ui/loading/index.js';

const SOCIALS = [
  { icon: <Github size={18}/>,   label: 'GitHub',   href: 'https://github.com/Utkal9' },
  { icon: <Linkedin size={18}/>, label: 'LinkedIn', href: 'https://linkedin.com/in/utkal-behera59/' },
];

export default function ContactSection({ config }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const contact = config?.contact || {};

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await contactAPI.send(form);
      toast.success('Message sent! I\'ll get back to you soon 🎉');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl text-sm
    bg-slate-50 dark:bg-dark-card2
    border border-slate-200 dark:border-dark-border
    text-slate-800 dark:text-slate-200
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    focus:outline-none focus:border-accent-blue dark:focus:border-accent-blue/60
    transition-colors duration-200`;

  return (
    <section id="contact" className="py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold tracking-widest text-accent-blue uppercase mb-3 block">Contact</span>
          <h2 className="section-heading text-slate-900 dark:text-white">
            Let's <span className="grad-text">Connect</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Open to internships, full-time roles, and collaborations. Let's build something great together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Contact details */}
            {[
              { icon: <Mail size={18}/>,    label: 'Email',    value: contact.email || 'utkalbehera59@gmail.com', href: `mailto:${contact.email}` },
              { icon: <Phone size={18}/>,   label: 'Phone',    value: contact.phone || '+91-9692743044' },
              { icon: <MapPin size={18}/>,  label: 'Location', value: contact.location || 'Phagwara, Punjab' },
            ].map(item => (
              <div key={item.label}
                className="flex items-center gap-4 p-4 rounded-2xl
                  bg-white dark:bg-dark-card
                  border border-slate-100 dark:border-dark-border
                  hover:border-accent-blue/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 dark:bg-accent-blue/10
                  flex items-center justify-center text-accent-blue flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">{item.label}</div>
                  {item.href
                    ? <a href={item.href} className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-accent-blue transition-colors">{item.value}</a>
                    : <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.value}</div>
                  }
                </div>
              </div>
            ))}

            {/* Socials */}
            <div className="flex gap-3">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                    bg-slate-50 dark:bg-dark-card2
                    border border-slate-100 dark:border-dark-border
                    text-slate-600 dark:text-slate-400
                    hover:border-accent-blue/30 hover:text-accent-blue
                    transition-all text-xs font-medium">
                  {s.icon} {s.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 p-8 rounded-3xl
              bg-white dark:bg-dark-card
              border border-slate-100 dark:border-dark-border
              shadow-card-light dark:shadow-none"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Name <span className="text-red-400">*</span>
                </label>
                <input name="name" value={form.name} onChange={handleChange}
                  placeholder="Your name" className={inputClass} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="your@email.com" className={inputClass} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange}
                placeholder="What's this about?" className={inputClass} />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="Your message..." rows={5}
                className={`${inputClass} resize-none`} />
            </div>
            <ButtonLoader
              type="submit"
              loading={loading}
              loadingText="Sending…"
              className="w-full py-3.5 rounded-xl
                bg-grad-main text-white font-semibold text-sm
                shadow-glow-blue hover:shadow-glow-purple
                transition-all duration-300 hover:scale-[1.02]
                disabled:hover:scale-100"
            >
              <Send size={16}/> Send Message
            </ButtonLoader>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
