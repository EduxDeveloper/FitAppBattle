import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import { Shield, Database, Eye, Lock, UserCheck, Mail, ChevronLeft } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: Database,
      color: 'text-accent-purple',
      title: 'Recopilación de Datos',
      content: 'FitBattle AI recopila la información que proporcionas al registrarte y usar la aplicación: nombre, correo electrónico, datos físicos (peso, altura, edad, género), objetivos de fitness, registros de comidas y fotos de perfil. Estos datos son necesarios para ofrecerte una experiencia personalizada y calcular tus métricas nutricionales.'
    },
    {
      icon: Eye,
      color: 'text-accent-red',
      title: 'Uso de tus Datos',
      content: 'Tus datos se utilizan exclusivamente para: calcular tu IMC, TMB, TDEE y macros diarios; llevar registro de tu progreso nutricional; participar en retos con amigos; y personalizar tu experiencia en la aplicación. No utilizamos tus datos con fines publicitarios ni de marketing.'
    },
    {
      icon: Lock,
      color: 'text-warning',
      title: 'Almacenamiento y Seguridad',
      content: 'Tu información se almacena de forma segura en servidores protegidos. Las contraseñas se encriptan usando bcrypt y nunca se almacenan en texto plano. Las sesiones se manejan mediante tokens JWT con cookies seguras. Las imágenes de perfil se alojan en Cloudinary con conexión encriptada.'
    },
    {
      icon: Shield,
      color: 'text-success',
      title: 'Compartir con Terceros',
      content: 'No vendemos, alquilamos ni compartimos tu información personal con terceros. Los únicos servicios externos que utilizamos son: Cloudinary (almacenamiento de imágenes), Google Gemini AI (análisis nutricional de alimentos) y MongoDB Atlas (base de datos). Estos servicios solo procesan los datos estrictamente necesarios para su función.'
    },
    {
      icon: UserCheck,
      color: 'text-accent-purple',
      title: 'Tus Derechos',
      content: 'Tienes derecho a: acceder a toda tu información personal desde tu perfil; modificar tus datos en cualquier momento; solicitar la eliminación completa de tu cuenta y datos asociados contactándonos directamente. Puedes ejercer estos derechos en cualquier momento sin costo alguno.'
    },
    {
      icon: Mail,
      color: 'text-accent-red',
      title: 'Contacto',
      content: 'Si tienes preguntas sobre esta política de privacidad o deseas ejercer alguno de tus derechos sobre tus datos, puedes contactarnos a través de la sección de ajustes de la aplicación o enviando un correo electrónico al administrador de la plataforma.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Link to="/settings" className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <ChevronLeft className="w-5 h-5 text-adaptive-secondary" />
        </Link>
        <h1 className="text-2xl font-bold text-adaptive-primary">Privacidad</h1>
      </div>

      <GlassCard className="bg-gradient-to-br from-accent-purple/10 to-transparent border-accent-purple/20">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-accent-purple/20 rounded-xl shrink-0">
            <Shield className="w-5 h-5 text-accent-purple" />
          </div>
          <div>
            <h3 className="font-bold text-adaptive-primary text-sm mb-1">Tu privacidad es importante</h3>
            <p className="text-xs text-adaptive-secondary leading-relaxed">
              Esta política describe cómo FitBattle AI recopila, usa y protege tu información personal. 
              Al usar la aplicación, aceptas las prácticas descritas en esta política.
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-4">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <GlassCard key={i}>
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl bg-white/5 ${section.color} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-adaptive-primary text-sm mb-2">{section.title}</h3>
                  <p className="text-adaptive-secondary text-xs leading-relaxed">{section.content}</p>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-adaptive-secondary">
          Última actualización: Junio 2026
        </p>
      </div>
    </div>
  );
};

export default Privacy;
