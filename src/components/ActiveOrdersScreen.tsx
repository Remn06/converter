import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from '@/app/styles';
import { Language, Order, OrderStatus, Translations } from '@/types';
import { haptics } from '@/utils/haptics';

export const DEFAULT_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: '#ORD-1041',
    clientName: 'Oleksandr Kovalenko',
    phone: '+380 67 123 4567',
    itemsEn: 'Standard 100x50cm (5cm) — 16 packs & 4 sheets\nStandard Primer (10kg) — 4 buckets',
    itemsUk: 'Стандартний 100x50см (5см) — 16 упак. та 4 листів\nСтандартна ґрунтовка (10кг) — 4 відра',
    status: 'pending',
    createdAt: 'Today, 09:30',
  },
  {
    id: 'ord-2',
    orderNumber: '#ORD-1042',
    clientName: 'Maria Shevchenko',
    phone: '+380 50 987 6543',
    itemsEn: 'PNP (10cm) — 25 packs\nFacade Paint White (15kg) — 6 buckets',
    itemsUk: 'PNP (10см) — 25 упаковок\nФасадна фарба Біла (15кг) — 6 відер',
    status: 'in_progress',
    createdAt: 'Today, 11:15',
  },
  {
    id: 'ord-3',
    orderNumber: '#ORD-1043',
    clientName: 'Dmytro Bondar',
    phone: '+380 63 555 0199',
    itemsEn: 'Standard 100x50cm (10cm) — 10 packs\nStandard Primer (10kg) — 2 buckets',
    itemsUk: 'Стандартний 100x50см (10см) — 10 упаковок\nСтандартна ґрунтовка (10кг) — 2 відра',
    status: 'pending',
    createdAt: 'Today, 13:40',
  },
  {
    id: 'ord-4',
    orderNumber: '#ORD-1039',
    clientName: 'Iryna Melnyk',
    phone: '+380 97 222 3344',
    itemsEn: 'Standard 100x50cm (5cm) — 8 packs',
    itemsUk: 'Стандартний 100x50см (5см) — 8 упаковок',
    status: 'completed',
    createdAt: 'Yesterday, 16:20',
  },
];

type OrderFilter = 'active' | 'completed' | 'all';

interface ActiveOrdersScreenProps {
  t: Translations;
  language: Language;
  orders: Order[];
  setOrders: (value: Order[] | ((prev: Order[]) => Order[])) => Promise<void>;
}

export default function ActiveOrdersScreen({
  t,
  language,
  orders,
  setOrders,
}: ActiveOrdersScreenProps) {
  const [filter, setFilter] = useState<OrderFilter>('active');

  const updateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    haptics.success();
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: nextStatus } : order))
    );
  };

  const resetOrders = () => {
    haptics.light();
    setOrders(DEFAULT_ORDERS);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'active') return order.status === 'pending' || order.status === 'in_progress';
    if (filter === 'completed') return order.status === 'completed';
    return true;
  });

  const activeCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'in_progress'
  ).length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  const getStatusLabel = (status: OrderStatus) => {
    if (status === 'pending') return t.statusPending;
    if (status === 'in_progress') return t.statusInProgress;
    return t.statusCompleted;
  };

  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text style={styles.title}>{t.activeOrdersTitle}</Text>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[styles.filterPill, filter === 'active' && styles.activeFilterPill]}
            onPress={() => {
              haptics.selection();
              setFilter('active');
            }}
          >
            <Text
              style={[
                styles.filterPillText,
                filter === 'active' && styles.activeFilterPillText,
              ]}
            >
              {t.filterActive} ({activeCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'completed' && styles.activeFilterPill]}
            onPress={() => {
              haptics.selection();
              setFilter('completed');
            }}
          >
            <Text
              style={[
                styles.filterPillText,
                filter === 'completed' && styles.activeFilterPillText,
              ]}
            >
              {t.filterCompleted} ({completedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, filter === 'all' && styles.activeFilterPill]}
            onPress={() => {
              haptics.selection();
              setFilter('all');
            }}
          >
            <Text
              style={[styles.filterPillText, filter === 'all' && styles.activeFilterPillText]}
            >
              {t.filterAll} ({orders.length})
            </Text>
          </TouchableOpacity>
        </View>

        {filteredOrders.length === 0 ? (
          <Text style={styles.emptyOrdersText}>{t.noActiveOrders}</Text>
        ) : (
          filteredOrders.map((order) => {
            const isPending = order.status === 'pending';
            const isInProgress = order.status === 'in_progress';

            return (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <Text style={styles.orderDate}>{order.createdAt}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      isPending
                        ? styles.statusBadgePending
                        : isInProgress
                          ? styles.statusBadgeInProgress
                          : styles.statusBadgeCompleted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isPending
                          ? styles.statusTextPending
                          : isInProgress
                            ? styles.statusTextInProgress
                            : styles.statusTextCompleted,
                      ]}
                    >
                      {getStatusLabel(order.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>{t.orderClientLabel}</Text>
                  <Text style={styles.orderDetailValue}>
                    {order.clientName} • {order.phone}
                  </Text>
                </View>

                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>{t.orderItemsLabel}</Text>
                  <Text style={styles.orderDetailValue}>
                    {language === 'uk' ? order.itemsUk : order.itemsEn}
                  </Text>
                </View>

                {isPending && (
                  <TouchableOpacity
                    style={styles.orderActionBtn}
                    onPress={() => updateOrderStatus(order.id, 'in_progress')}
                  >
                    <Text style={styles.orderActionBtnText}>{t.startOrderBtn}</Text>
                  </TouchableOpacity>
                )}

                {isInProgress && (
                  <TouchableOpacity
                    style={[styles.orderActionBtn, styles.orderActionBtnComplete]}
                    onPress={() => updateOrderStatus(order.id, 'completed')}
                  >
                    <Text style={styles.orderActionBtnText}>{t.completeOrderBtn}</Text>
                  </TouchableOpacity>
                )}

                {!isPending && !isInProgress && (
                  <TouchableOpacity
                    style={[styles.orderActionBtn, styles.orderActionBtnReopen]}
                    onPress={() => updateOrderStatus(order.id, 'in_progress')}
                  >
                    <Text style={styles.orderActionBtnText}>{t.reopenOrderBtn}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}

        <TouchableOpacity style={styles.secondaryButton} onPress={resetOrders}>
          <Text style={styles.secondaryButtonText}>{t.resetOrdersBtn}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}
