import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import ActiveOrdersScreen, { DEFAULT_ORDERS } from '@/components/ActiveOrdersScreen';
import EmployeeLoginScreen from '@/components/EmployeeLoginScreen';
import MakeOrderScreen from '@/components/MakeOrderScreen';
import PaintScreen from '@/components/PaintScreen';
import RoleSelectionScreen from '@/components/RoleSelectionScreen';
import StyrofoamScreen from '@/components/StyrofoamScreen';
import { dict } from '@/constants/translations';
import { useStoredData } from '@/hooks/useStoredData';
import { Language, Order, UserRole } from '@/types';
import { haptics } from '@/utils/haptics';
import styles from './styles';

type Tab = 'styrofoam' | 'paint' | 'order';
type AuthStep = 'select' | 'login';
type EmployeeSection = 'orders' | 'converter';

export default function App() {
  const { width } = useWindowDimensions();
  const pagerRef = useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = useState<Tab>('styrofoam');
  const [authStep, setAuthStep] = useState<AuthStep>('select');
  const [employeeSection, setEmployeeSection] = useState<EmployeeSection>('orders');
  const [draftItems, setDraftItems] = useState('');

  const [language, setLanguage] = useStoredData<Language>(
    '@language',
    'uk',
    (saved) => (saved === 'en' || saved === 'uk' ? saved : 'uk')
  );

  const [userRole, setUserRole, isRoleLoading] = useStoredData<UserRole>(
    '@user_role',
    'none',
    (saved) => (saved === 'client' || saved === 'employee' ? saved : 'none')
  );

  const [orders, setOrders] = useStoredData<Order[]>('@active_orders', DEFAULT_ORDERS);

  const t = dict[language];

  const toggleLanguage = () => {
    haptics.selection();
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  const handleSelectClient = () => {
    setActiveTab('styrofoam');
    setUserRole('client');
  };

  const handleSelectEmployee = () => {
    setAuthStep('login');
  };

  const handleEmployeeLoginSuccess = () => {
    setEmployeeSection('orders');
    setUserRole('employee');
  };

  const handleSwitchRoleOrLogout = () => {
    haptics.selection();
    setAuthStep('select');
    setActiveTab('styrofoam');
    setUserRole('none');
  };

  const handleTabPress = (tab: Tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      const pageIndex = tab === 'styrofoam' ? 0 : tab === 'paint' ? 1 : 2;
      pagerRef.current?.scrollTo({ x: pageIndex * width, animated: true });
    }
  };

  const handleSwipeEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width <= 0) return;
    const pageIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    const nextTab: Tab =
      pageIndex === 2 ? 'order' : pageIndex === 1 ? 'paint' : 'styrofoam';
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
  };

  const handleAddToOrder = (lineItem: string) => {
    setDraftItems((prev) => (prev.trim() ? `${prev.trim()}\n${lineItem}` : lineItem));
    handleTabPress('order');
  };

  const handleCreateOrder = (clientName: string, phone: string, items: string) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const orderNum = `#ORD-${Math.floor(1044 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      clientName,
      phone,
      itemsEn: items,
      itemsUk: items,
      status: 'pending',
      createdAt: `Today, ${hours}:${minutes}`,
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  if (isRoleLoading) {
    return <View style={styles.container} />;
  }

  const showOrderTab = userRole === 'client';

  const renderConverter = () => (
    <>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'styrofoam' && styles.activeTabButton]}
          onPress={() => handleTabPress('styrofoam')}
        >
          <Text style={[styles.tabText, activeTab === 'styrofoam' && styles.activeTabText]}>
            {t.styrofoamTab}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'paint' && styles.activeTabButton]}
          onPress={() => handleTabPress('paint')}
        >
          <Text style={[styles.tabText, activeTab === 'paint' && styles.activeTabText]}>
            {t.paintTab}
          </Text>
        </TouchableOpacity>
        {showOrderTab && (
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'order' && styles.activeTabButton]}
            onPress={() => handleTabPress('order')}
          >
            <Text style={[styles.tabText, activeTab === 'order' && styles.activeTabText]}>
              {t.makeOrderTab}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        ref={pagerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleSwipeEnd}
        keyboardDismissMode="on-drag"
        style={{ flex: 1 }}
      >
        <View style={{ width, flex: 1 }}>
          <StyrofoamScreen
            t={t}
            onAddToOrder={showOrderTab ? handleAddToOrder : undefined}
          />
        </View>

        <View style={{ width, flex: 1 }}>
          <PaintScreen
            t={t}
            onAddToOrder={showOrderTab ? handleAddToOrder : undefined}
          />
        </View>

        {showOrderTab && (
          <View style={{ width, flex: 1 }}>
            <MakeOrderScreen
              t={t}
              draftItems={draftItems}
              setDraftItems={setDraftItems}
              onSubmitOrder={handleCreateOrder}
            />
          </View>
        )}
      </ScrollView>
    </>
  );

  return (
    <View style={styles.container}>
      {/* --- TOP HEADER W/ ROLE SWITCH & LANGUAGE TOGGLE --- */}
      <View style={[styles.headerRow, userRole === 'none' && styles.headerRowRightOnly]}>
        {userRole !== 'none' && (
          <TouchableOpacity
            style={styles.roleSwitchButton}
            onPress={handleSwitchRoleOrLogout}
          >
            <Text style={styles.roleSwitchButtonText}>
              {userRole === 'employee' ? t.logoutBtn : t.switchRoleBtn}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
          <Text style={styles.langButtonText}>{t.langToggle}</Text>
        </TouchableOpacity>
      </View>

      {userRole === 'none' ? (
        authStep === 'select' ? (
          <RoleSelectionScreen
            t={t}
            onSelectClient={handleSelectClient}
            onSelectEmployee={handleSelectEmployee}
          />
        ) : (
          <EmployeeLoginScreen
            t={t}
            onLoginSuccess={handleEmployeeLoginSuccess}
            onBack={() => setAuthStep('select')}
          />
        )
      ) : userRole === 'employee' ? (
        <>
          <View style={styles.employeeNavContainer}>
            <TouchableOpacity
              style={[
                styles.employeeNavBtn,
                employeeSection === 'orders' && styles.activeEmployeeNavBtn,
              ]}
              onPress={() => {
                haptics.selection();
                setEmployeeSection('orders');
              }}
            >
              <Text
                style={[
                  styles.employeeNavText,
                  employeeSection === 'orders' && styles.activeEmployeeNavText,
                ]}
              >
                {t.activeOrdersTab}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.employeeNavBtn,
                employeeSection === 'converter' && styles.activeEmployeeNavBtn,
              ]}
              onPress={() => {
                haptics.selection();
                setActiveTab('styrofoam');
                setEmployeeSection('converter');
              }}
            >
              <Text
                style={[
                  styles.employeeNavText,
                  employeeSection === 'converter' && styles.activeEmployeeNavText,
                ]}
              >
                {t.converterTab}
              </Text>
            </TouchableOpacity>
          </View>

          {employeeSection === 'orders' ? (
            <ActiveOrdersScreen
              t={t}
              language={language}
              orders={orders}
              setOrders={setOrders}
            />
          ) : (
            renderConverter()
          )}
        </>
      ) : (
        renderConverter()
      )}
    </View>
  );
}
