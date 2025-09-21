"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Shield,
  Bell,
  User,
  Download,
  Trash2,
  Phone,
  AlertTriangle,
  Heart,
  Lock,
  Eye,
  Globe,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useRouter } from "next/navigation"

// Simple i18n translations
const translations = {
  en: {
    settings: "Settings",
    customize: "Customize your Echoes experience and safety preferences",
    privacy: "Privacy & Safety",
    notifications: "Notifications",
    preferences: "Preferences",
    crisis: "Crisis Support",
    account: "Account",
    privacyTitle: "Privacy & Safety Settings",
    privacyDesc: "Control how your data is used and ensure your safety while using Echoes",
    anonymousMode: "Anonymous Mode",
    anonymousDesc: "Use Echoes without creating an account or storing personal data",
    crisisDetection: "Crisis Detection",
    crisisDetectionDesc: "AI monitors for signs of crisis and provides immediate support resources",
    dataSharing: "Anonymous Data Sharing",
    dataSharingDesc: "Help improve Echoes by sharing anonymized usage patterns",
    parentalNotifications: "Parental Notifications",
    parentalNotificationsDesc: "Notify parent/guardian of significant mood changes (if under 18)",
    dataEncryption: "Data Encryption & Security",
    endToEnd: "End-to-End Encryption",
    endToEndDesc: "All your conversations are encrypted",
    zeroKnowledge: "Zero-Knowledge Architecture",
    zeroKnowledgeDesc: "We cannot read your private data",
    notificationTitle: "Notification Preferences",
    notificationDesc: "Choose when and how you'd like to hear from Echoes",
    dailyReminders: "Daily Check-ins",
    dailyRemindersDesc: "Gentle reminders to log your mood",
    weeklyInsights: "Weekly Insights",
    weeklyInsightsDesc: "Summary of your progress and growth",
    milestoneAlerts: "Milestone Celebrations",
    milestoneAlertsDesc: "Notifications when you achieve goals",
    practiceReminders: "Practice Reminders",
    practiceRemindersDesc: "Suggestions to try roleplay conversations",
    appPreferences: "App Preferences",
    appPreferencesDesc: "Customize how Echoes looks and behaves",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    language: "Language",
    voiceFeatures: "Voice Features",
    voiceFeaturesDesc: "Enable voice recording and playback",
    autoSave: "Auto-Save Entries",
    autoSaveDesc: "Automatically save your journal entries",
    crisisSupport: "Crisis Support Resources",
    crisisSupportDesc: "If you're in immediate danger, please call 112 (India's emergency number) immediately",
    emergency: "Emergency: Call 112 (India) or your local emergency number",
    crisisHelplines: "Crisis Helplines",
    personalContacts: "Personal Crisis Contacts",
    emergencyContact: "Emergency Contact",
    localHelpline: "Local Helpline",
    preferredCounselor: "Preferred Counselor/Therapist",
    accountManagement: "Account Management",
    manageAccount: "Manage your account data and preferences",
    exportData: "Export Your Data",
    exportDesc: "Download all your journal entries, insights, and progress data",
    shareStory: "Share Your Story",
    shareDesc: "Help others by sharing your growth journey anonymously",
    dangerZone: "Danger Zone",
    deleteAll: "Delete All Data",
    deleteAllDesc: "Permanently delete all your journal entries, progress data, and account information. This action cannot be undone.",
    saveAll: "Save All Settings",
  },
  es: {
    settings: "Configuración",
    customize: "Personaliza tu experiencia en Echoes y preferencias de seguridad",
    privacy: "Privacidad y Seguridad",
    notifications: "Notificaciones",
    preferences: "Preferencias",
    crisis: "Apoyo en Crisis",
    account: "Cuenta",
    privacyTitle: "Configuración de Privacidad y Seguridad",
    privacyDesc: "Controla cómo se usa tu información y garantiza tu seguridad en Echoes",
    anonymousMode: "Modo Anónimo",
    anonymousDesc: "Usa Echoes sin crear una cuenta ni almacenar datos personales",
    crisisDetection: "Detección de Crisis",
    crisisDetectionDesc: "La IA monitorea signos de crisis y proporciona recursos de apoyo inmediatos",
    dataSharing: "Compartir Datos Anónimos",
    dataSharingDesc: "Ayuda a mejorar Echoes compartiendo patrones de uso anonimizados",
    parentalNotifications: "Notificaciones Parentales",
    parentalNotificationsDesc: "Notifica a padres/tutores sobre cambios significativos de ánimo (si eres menor de 18)",
    dataEncryption: "Encriptación y Seguridad de Datos",
    endToEnd: "Encriptación de extremo a extremo",
    endToEndDesc: "Todas tus conversaciones están encriptadas",
    zeroKnowledge: "Arquitectura de Conocimiento Cero",
    zeroKnowledgeDesc: "No podemos leer tus datos privados",
    notificationTitle: "Preferencias de Notificación",
    notificationDesc: "Elige cuándo y cómo quieres recibir notificaciones de Echoes",
    dailyReminders: "Recordatorios Diarios",
    dailyRemindersDesc: "Recordatorios suaves para registrar tu estado de ánimo",
    weeklyInsights: "Perspectivas Semanales",
    weeklyInsightsDesc: "Resumen de tu progreso y crecimiento",
    milestoneAlerts: "Celebraciones de Logros",
    milestoneAlertsDesc: "Notificaciones cuando alcanzas metas",
    practiceReminders: "Recordatorios de Práctica",
    practiceRemindersDesc: "Sugerencias para practicar conversaciones de rol",
    appPreferences: "Preferencias de la Aplicación",
    appPreferencesDesc: "Personaliza cómo se ve y funciona Echoes",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    language: "Idioma",
    voiceFeatures: "Funciones de Voz",
    voiceFeaturesDesc: "Habilita la grabación y reproducción de voz",
    autoSave: "Guardado Automático",
    autoSaveDesc: "Guarda automáticamente tus entradas de diario",
    crisisSupport: "Recursos de Apoyo en Crisis",
    crisisSupportDesc: "Si estás en peligro inmediato, llama al 112 (número de emergencia de India) inmediatamente",
    emergency: "Emergencia: Llama al 112 (India) o a tu número de emergencia local",
    crisisHelplines: "Líneas de Ayuda en Crisis",
    personalContacts: "Contactos Personales de Crisis",
    emergencyContact: "Contacto de Emergencia",
    localHelpline: "Línea de Ayuda Local",
    preferredCounselor: "Consejero/Terapeuta Preferido",
    accountManagement: "Gestión de Cuenta",
    manageAccount: "Administra tus datos y preferencias de cuenta",
    exportData: "Exportar tus Datos",
    exportDesc: "Descarga todas tus entradas de diario, perspectivas y datos de progreso",
    shareStory: "Comparte tu Historia",
    shareDesc: "Ayuda a otros compartiendo tu viaje de crecimiento de forma anónima",
    dangerZone: "Zona de Peligro",
    deleteAll: "Eliminar Todos los Datos",
    deleteAllDesc: "Elimina permanentemente todas tus entradas de diario, datos de progreso e información de cuenta. Esta acción no se puede deshacer.",
    saveAll: "Guardar toda la configuración",
  },
  hi: {
    settings: "सेटिंग्स",
    customize: "अपना Echoes अनुभव और सुरक्षा प्राथमिकताएँ अनुकूलित करें",
    privacy: "गोपनीयता और सुरक्षा",
    notifications: "सूचनाएँ",
    preferences: "प्राथमिकताएँ",
    crisis: "संकट सहायता",
    account: "खाता",
    privacyTitle: "गोपनीयता और सुरक्षा सेटिंग्स",
    privacyDesc: "अपने डेटा के उपयोग को नियंत्रित करें और Echoes का सुरक्षित उपयोग सुनिश्चित करें",
    anonymousMode: "गुमनाम मोड",
    anonymousDesc: "बिना खाता बनाए या व्यक्तिगत डेटा संग्रहीत किए Echoes का उपयोग करें",
    crisisDetection: "संकट पहचान",
    crisisDetectionDesc: "AI संकट के संकेतों की निगरानी करता है और तत्काल सहायता संसाधन प्रदान करता है",
    dataSharing: "गुमनाम डेटा साझा करना",
    dataSharingDesc: "गुमनाम उपयोग पैटर्न साझा करके Echoes को बेहतर बनाने में मदद करें",
    parentalNotifications: "अभिभावक सूचनाएँ",
    parentalNotificationsDesc: "महत्वपूर्ण मूड परिवर्तनों पर माता-पिता/अभिभावक को सूचित करें (यदि 18 से कम)",
    dataEncryption: "डेटा एन्क्रिप्शन और सुरक्षा",
    endToEnd: "एंड-टू-एंड एन्क्रिप्शन",
    endToEndDesc: "आपकी सभी बातचीत एन्क्रिप्टेड हैं",
    zeroKnowledge: "शून्य-ज्ञान वास्तुकला",
    zeroKnowledgeDesc: "हम आपके निजी डेटा को नहीं पढ़ सकते",
    notificationTitle: "सूचना प्राथमिकताएँ",
    notificationDesc: "Echoes से सूचनाएँ कब और कैसे प्राप्त करना है चुनें",
    dailyReminders: "दैनिक चेक-इन",
    dailyRemindersDesc: "अपने मूड को लॉग करने के लिए कोमल अनुस्मारक",
    weeklyInsights: "साप्ताहिक अंतर्दृष्टि",
    weeklyInsightsDesc: "आपकी प्रगति और विकास का सारांश",
    milestoneAlerts: "मील का पत्थर उत्सव",
    milestoneAlertsDesc: "लक्ष्य प्राप्त करने पर सूचनाएँ",
    practiceReminders: "अभ्यास अनुस्मारक",
    practiceRemindersDesc: "रोलप्ले वार्तालापों का प्रयास करने के सुझाव",
    appPreferences: "ऐप प्राथमिकताएँ",
    appPreferencesDesc: "Echoes का रूप और व्यवहार अनुकूलित करें",
    theme: "थीम",
    light: "हल्का",
    dark: "गहरा",
    system: "सिस्टम",
    language: "भाषा",
    voiceFeatures: "वॉयस फीचर्स",
    voiceFeaturesDesc: "वॉयस रिकॉर्डिंग और प्लेबैक सक्षम करें",
    autoSave: "ऑटो-सेव प्रविष्टियाँ",
    autoSaveDesc: "अपने जर्नल प्रविष्टियाँ स्वचालित रूप से सहेजें",
    crisisSupport: "संकट सहायता संसाधन",
    crisisSupportDesc: "यदि आप तत्काल खतरे में हैं, तो कृपया तुरंत 112 (भारत का आपातकालीन नंबर) पर कॉल करें",
    emergency: "आपातकाल: 112 (भारत) या अपने स्थानीय आपातकालीन नंबर पर कॉल करें",
    crisisHelplines: "संकट हेल्पलाइन",
    personalContacts: "व्यक्तिगत संकट संपर्क",
    emergencyContact: "आपातकालीन संपर्क",
    localHelpline: "स्थानीय हेल्पलाइन",
    preferredCounselor: "पसंदीदा काउंसलर/थेरेपिस्ट",
    accountManagement: "खाता प्रबंधन",
    manageAccount: "अपने खाता डेटा और प्राथमिकताएँ प्रबंधित करें",
    exportData: "अपने डेटा निर्यात करें",
    exportDesc: "अपने सभी जर्नल प्रविष्टियाँ, अंतर्दृष्टि और प्रगति डेटा डाउनलोड करें",
    shareStory: "अपनी कहानी साझा करें",
    shareDesc: "अपनी वृद्धि यात्रा को गुमनाम रूप से साझा करके दूसरों की मदद करें",
    dangerZone: "खतरनाक क्षेत्र",
    deleteAll: "सभी डेटा हटाएँ",
    deleteAllDesc: "अपने सभी जर्नल प्रविष्टियाँ, प्रगति डेटा और खाता जानकारी स्थायी रूप से हटाएँ। यह क्रिया पूर्ववत नहीं की जा सकती।",
    saveAll: "सभी सेटिंग्स सहेजें",
  },
  fr: {
    settings: "Paramètres",
    customize: "Personnalisez votre expérience Echoes et vos préférences de sécurité",
    privacy: "Confidentialité et Sécurité",
    notifications: "Notifications",
    preferences: "Préférences",
    crisis: "Soutien en cas de crise",
    account: "Compte",
    privacyTitle: "Paramètres de confidentialité et de sécurité",
    privacyDesc: "Contrôlez l'utilisation de vos données et assurez votre sécurité sur Echoes",
    anonymousMode: "Mode Anonyme",
    anonymousDesc: "Utilisez Echoes sans créer de compte ni stocker de données personnelles",
    crisisDetection: "Détection de crise",
    crisisDetectionDesc: "L'IA surveille les signes de crise et fournit des ressources de soutien immédiates",
    dataSharing: "Partage de données anonymes",
    dataSharingDesc: "Aidez à améliorer Echoes en partageant des modèles d'utilisation anonymisés",
    parentalNotifications: "Notifications parentales",
    parentalNotificationsDesc: "Informer le parent/tuteur des changements d'humeur importants (si moins de 18 ans)",
    dataEncryption: "Chiffrement et sécurité des données",
    endToEnd: "Chiffrement de bout en bout",
    endToEndDesc: "Toutes vos conversations sont chiffrées",
    zeroKnowledge: "Architecture zéro connaissance",
    zeroKnowledgeDesc: "Nous ne pouvons pas lire vos données privées",
    notificationTitle: "Préférences de notification",
    notificationDesc: "Choisissez quand et comment vous souhaitez recevoir des notifications d'Echoes",
    dailyReminders: "Rappels quotidiens",
    dailyRemindersDesc: "Rappels doux pour enregistrer votre humeur",
    weeklyInsights: "Perspectives hebdomadaires",
    weeklyInsightsDesc: "Résumé de vos progrès et de votre croissance",
    milestoneAlerts: "Célébrations de jalons",
    milestoneAlertsDesc: "Notifications lorsque vous atteignez des objectifs",
    practiceReminders: "Rappels de pratique",
    practiceRemindersDesc: "Suggestions pour essayer des conversations de rôle",
    appPreferences: "Préférences de l'application",
    appPreferencesDesc: "Personnalisez l'apparence et le fonctionnement d'Echoes",
    theme: "Thème",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
    language: "Langue",
    voiceFeatures: "Fonctionnalités vocales",
    voiceFeaturesDesc: "Activer l'enregistrement et la lecture vocale",
    autoSave: "Enregistrement automatique",
    autoSaveDesc: "Enregistrez automatiquement vos entrées de journal",
    crisisSupport: "Ressources de soutien en cas de crise",
    crisisSupportDesc: "En cas de danger immédiat, appelez le 112 (numéro d'urgence en Inde) immédiatement",
    emergency: "Urgence : Appelez le 112 (Inde) ou votre numéro d'urgence local",
    crisisHelplines: "Lignes d'assistance en cas de crise",
    personalContacts: "Contacts personnels de crise",
    emergencyContact: "Contact d'urgence",
    localHelpline: "Ligne d'assistance locale",
    preferredCounselor: "Conseiller/thérapeute préféré",
    accountManagement: "Gestion du compte",
    manageAccount: "Gérez vos données et préférences de compte",
    exportData: "Exporter vos données",
    exportDesc: "Téléchargez toutes vos entrées de journal, perspectives et données de progression",
    shareStory: "Partagez votre histoire",
    shareDesc: "Aidez les autres en partageant anonymement votre parcours de croissance",
    dangerZone: "Zone de danger",
    deleteAll: "Supprimer toutes les données",
    deleteAllDesc: "Supprimez définitivement toutes vos entrées de journal, données de progression et informations de compte. Cette action ne peut pas être annulée.",
    saveAll: "Enregistrer tous les paramètres",
  },
};

function t(key, lang) {
  return translations[lang]?.[key] || translations["en"][key] || key;
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    // Privacy & Safety
    anonymousMode: false,
    dataSharing: false,
    crisisDetection: true,
    parentalNotifications: false,

    // Notifications
    dailyReminders: true,
    weeklyInsights: true,
    milestoneAlerts: true,
    practiceReminders: false,

    // Preferences
    theme: "light",
    language: "en",
    voiceEnabled: true,
    autoSave: true,

    // Crisis Contacts
    emergencyContact: "",
    localHelpline: "",
    preferredCounselor: "",
  })

  const router = useRouter()

  // Load saved preferences on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("echoes-settings")
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      setSettings(parsedSettings)
      // Apply the saved theme
      if (parsedSettings.theme) {
        setTheme(parsedSettings.theme)
      }
    }
  }, [setTheme])

  // Sync theme state with settings state
  useEffect(() => {
    if (theme) {
      setSettings(prev => ({ ...prev, theme }))
    }
  }, [theme])

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    // Immediately apply theme changes
    if (key === "theme") {
      setTheme(value)
    }
  }

  const saveSettings = async () => {
    try {
      // Save to localStorage
      localStorage.setItem("echoes-settings", JSON.stringify(settings))

      // TODO: Save to API when user is authenticated
      // const response = await fetch('/api/auth/preferences', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(settings),
      // })

      // Show success feedback
      alert("Settings saved successfully!")
    } catch (error) {
      console.error("Failed to save settings:", error)
      alert("Failed to save settings. Please try again.")
    }
  }

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support in English and Spanish",
      country: "US",
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 crisis support via text message",
      country: "US",
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service",
      country: "US",
    },
    {
      name: "International Association for Suicide Prevention",
      number: "Visit iasp.info/resources",
      description: "Global directory of crisis centers",
      country: "International",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">{t("settings", settings.language)}</h1>
            <p className="text-muted-foreground">{t("customize", settings.language)}</p>
          </div>
        </div>

        <Tabs defaultValue="privacy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="privacy">{t("privacy", settings.language)}</TabsTrigger>
            <TabsTrigger value="notifications">{t("notifications", settings.language)}</TabsTrigger>
            <TabsTrigger value="preferences">{t("preferences", settings.language)}</TabsTrigger>
            <TabsTrigger value="crisis">{t("crisis", settings.language)}</TabsTrigger>
            <TabsTrigger value="account">{t("account", settings.language)}</TabsTrigger>
          </TabsList>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t("privacyTitle", settings.language)}
                </CardTitle>
                <CardDescription>
                  {t("privacyDesc", settings.language)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="anonymous-mode" className="font-medium">
                      {t("anonymousMode", settings.language)}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("anonymousDesc", settings.language)}
                    </p>
                  </div>
                  <Switch
                    id="anonymous-mode"
                    checked={settings.anonymousMode}
                    onCheckedChange={(value) => updateSetting("anonymousMode", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="crisis-detection" className="font-medium">
                      {t("crisisDetection", settings.language)}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("crisisDetectionDesc", settings.language)}
                    </p>
                  </div>
                  <Switch
                    id="crisis-detection"
                    checked={settings.crisisDetection}
                    onCheckedChange={(value) => updateSetting("crisisDetection", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="data-sharing" className="font-medium">
                      {t("dataSharing", settings.language)}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("dataSharingDesc", settings.language)}
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.dataSharing}
                    onCheckedChange={(value) => updateSetting("dataSharing", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="parental-notifications" className="font-medium">
                      {t("parentalNotifications", settings.language)}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("parentalNotificationsDesc", settings.language)}
                    </p>
                  </div>
                  <Switch
                    id="parental-notifications"
                    checked={settings.parentalNotifications}
                    onCheckedChange={(value) => updateSetting("parentalNotifications", value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading">{t("dataEncryption", settings.language)}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">End-to-End Encryption</p>
                    <p className="text-sm text-muted-foreground">{t("endToEndDesc", settings.language)}</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">Active</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                  <Eye className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Zero-Knowledge Architecture</p>
                    <p className="text-sm text-muted-foreground">{t("zeroKnowledgeDesc", settings.language)}</p>
                  </div>
                  <Badge className="bg-primary text-primary-foreground">Active</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <Bell className="h-5 w-5 text-secondary" />
                  {t("notificationTitle", settings.language)}
                </CardTitle>
                <CardDescription>{t("notificationDesc", settings.language)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="daily-reminders" className="font-medium">
                      {t("dailyReminders", settings.language)}
                    </Label>
                    <p className="text-sm text-muted-foreground">{t("dailyRemindersDesc", settings.language)}</p>
                  </div>
                  <Switch
                    id="daily-reminders"
                    checked={settings.dailyReminders}
                    onCheckedChange={(value) => updateSetting("dailyReminders", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="weekly-insights" className="font-medium">
                      {t("weeklyInsights", settings.language)}
                    </Label>
                    <p className="text-sm text-muted-foreground">{t("weeklyInsightsDesc", settings.language)}</p>
                  </div>
                  <Switch
                    id="weekly-insights"
                    checked={settings.weeklyInsights}
                    onCheckedChange={(value) => updateSetting("weeklyInsights", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="milestone-alerts" className="font-medium">
                      {t("milestoneAlerts", settings.language)}
                    </Label>
                    <p className="text-sm text-muted-foreground">{t("milestoneAlertsDesc", settings.language)}</p>
                  </div>
                  <Switch
                    id="milestone-alerts"
                    checked={settings.milestoneAlerts}
                    onCheckedChange={(value) => updateSetting("milestoneAlerts", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="practice-reminders" className="font-medium">
                      {t("practiceReminders", settings.language)}
                    </Label>
                    <p className="text-sm text-muted-foreground">{t("practiceRemindersDesc", settings.language)}</p>
                  </div>
                  <Switch
                    id="practice-reminders"
                    checked={settings.practiceReminders}
                    onCheckedChange={(value) => updateSetting("practiceReminders", value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  {t("appPreferences", settings.language)}
                </CardTitle>
                <CardDescription>{t("appPreferencesDesc", settings.language)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Theme</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={settings.theme === "light" ? "default" : "outline"}
                        onClick={() => updateSetting("theme", "light")}
                        className="flex items-center gap-2"
                      >
                        <Sun className="h-5 w-5 text-yellow-500" /> {t("light", settings.language)}
                        {settings.theme === "light" && <span className="ml-1">✓</span>}
                      </Button>
                      <Button
                        variant={settings.theme === "dark" ? "default" : "outline"}
                        onClick={() => updateSetting("theme", "dark")}
                        className="flex items-center gap-2"
                      >
                        <Moon className="h-5 w-5 text-blue-500" /> {t("dark", settings.language)}
                        {settings.theme === "dark" && <span className="ml-1">✓</span>}
                      </Button>
                      <Button
                        variant={settings.theme === "system" ? "default" : "outline"}
                        onClick={() => updateSetting("theme", "system")}
                        className="flex items-center gap-2"
                      >
                        <Globe className="h-5 w-5 text-green-500" /> {t("system", settings.language)}
                        {settings.theme === "system" && <span className="ml-1">✓</span>}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="hi">हिन्दी</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="voice-enabled" className="font-medium flex items-center gap-2">
                      {settings.voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      {t("voiceFeatures", settings.language)}
                    </Label>
                    <p className="text-sm text-muted-foreground">{t("voiceFeaturesDesc", settings.language)}</p>
                  </div>
                  <Switch
                    id="voice-enabled"
                    checked={settings.voiceEnabled}
                    onCheckedChange={(value) => updateSetting("voiceEnabled", value)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <Label htmlFor="auto-save" className="font-medium">
                      {t("autoSave", settings.language)}
                    </Label>
                    <p className="text-sm text-muted-foreground">{t("autoSaveDesc", settings.language)}</p>
                  </div>
                  <Switch
                    id="auto-save"
                    checked={settings.autoSave}
                    onCheckedChange={(value) => updateSetting("autoSave", value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crisis" className="space-y-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-destructive/5 to-accent/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  {t("crisisSupport", settings.language)}
                </CardTitle>
                <CardDescription>
                  {t("crisisSupportDesc", settings.language)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="h-5 w-5 text-destructive" />
                    <h3 className="font-heading font-semibold text-destructive">
                      {t("emergency", settings.language)}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    If you are having thoughts of suicide or self-harm, please reach out for help immediately.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-heading font-semibold">Crisis Helplines</h3>
                  {t("crisisHelplines", settings.language)}
                  {crisisResources.map((resource, index) => (
                    <Card key={index} className="bg-background/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-heading font-semibold">{resource.name}</h4>
                          <Badge variant="secondary">{resource.country}</Badge>
                        </div>
                        <p className="text-lg font-mono font-semibold text-primary mb-2">{resource.number}</p>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="space-y-4">
                  <h3 className="font-heading font-semibold">Personal Crisis Contacts</h3>
                  {t("personalContacts", settings.language)}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="emergency-contact">Emergency Contact</Label>
                      {t("emergencyContact", settings.language)}
                      <Input
                        id="emergency-contact"
                        placeholder="Name and phone number"
                        value={settings.emergencyContact}
                        onChange={(e) => updateSetting("emergencyContact", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="local-helpline">Local Helpline</Label>
                      {t("localHelpline", settings.language)}
                      <Input
                        id="local-helpline"
                        placeholder="India's emergency number: 112"
                        value={settings.localHelpline}
                        onChange={(e) => updateSetting("localHelpline", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferred-counselor">Preferred Counselor/Therapist</Label>
                      {t("preferredCounselor", settings.language)}
                      <Input
                        id="preferred-counselor"
                        placeholder="Name and contact information"
                        value={settings.preferredCounselor}
                        onChange={(e) => updateSetting("preferredCounselor", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading">{t("accountManagement", settings.language)}</CardTitle>
                <CardDescription>{t("manageAccount", settings.language)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-background/50">
                    <CardContent className="p-4 text-center">
                      <Download className="h-8 w-8 text-primary mx-auto mb-3" />
                      <h3 className="font-heading font-semibold mb-2">Export Your Data</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("exportDesc", settings.language)}
                      </p>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Download className="mr-2 h-4 w-4" />
                        Export Data
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-destructive/5 border border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-lg font-heading text-destructive flex items-center gap-2">
                      <Trash2 className="h-5 w-5" />
                      {t("dangerZone", settings.language)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-heading font-semibold mb-2">Delete All Data</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("deleteAllDesc", settings.language)}
                      </p>
                      <Button variant="destructive" className="bg-destructive hover:bg-destructive/90">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete All Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button
            onClick={saveSettings}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            {t("saveAll", settings.language)}
          </Button>
        </div>
      </div>
    </div>
  )
}
