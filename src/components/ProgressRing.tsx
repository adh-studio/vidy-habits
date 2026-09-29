import { ReactNode, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  /** Progression entre 0 et 1. */
  progress: number;
  size?: number;
  stroke?: number;
  color: string;
  trackColor: string;
  children?: ReactNode;
}

/**
 * Anneau de progression circulaire animé, sans dépendance SVG.
 *
 * Technique classique dite « des deux moitiés » : deux demi-anneaux colorés
 * découpés puis pivotés avec Reanimated révèlent progressivement la
 * progression par-dessus un anneau de fond (track).
 */
export function ProgressRing({
  progress,
  size = 132,
  stroke = 14,
  color,
  trackColor,
  children,
}: Props) {
  const clamped = Math.max(0, Math.min(1, progress));
  const value = useSharedValue(0);

  useEffect(() => {
    value.value = withTiming(clamped, { duration: 700 });
  }, [clamped, value]);

  const half = size / 2;

  // Moitié droite : gère les premiers 50 % (rotation 0 → 180°).
  const rightRotation = useAnimatedStyle(() => {
    const deg = Math.min(value.value, 0.5) * 360;
    return { transform: [{ rotate: `${deg}deg` }] };
  });

  // Moitié gauche : gère les 50 % restants, révélée au-delà de la moitié.
  const leftRotation = useAnimatedStyle(() => {
    const deg = Math.max(value.value - 0.5, 0) * 360;
    return { transform: [{ rotate: `${deg}deg` }], opacity: value.value > 0.5 ? 1 : 0 };
  });

  const ring = {
    width: size,
    height: size,
    borderRadius: half,
    borderWidth: stroke,
  } as const;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* Anneau de fond */}
      <View style={[ring, { borderColor: trackColor, position: 'absolute' }]} />

      {/* Premiers 50 % : découpe sur la moitié droite */}
      <View style={[styles.clip, { left: half, width: half, height: size }]}>
        <Animated.View style={[{ width: size, height: size, left: -half }, rightRotation]}>
          <View style={[styles.clip, { width: half, height: size }]}>
            <View style={[ring, { borderColor: color }]} />
          </View>
        </Animated.View>
      </View>

      {/* Derniers 50 % : découpe sur la moitié gauche */}
      <View style={[styles.clip, { left: 0, width: half, height: size }]}>
        <Animated.View style={[{ width: size, height: size, left: 0 }, leftRotation]}>
          <View style={[styles.clip, { left: half, width: half, height: size }]}>
            <View style={[ring, { borderColor: color, left: -half }]} />
          </View>
        </Animated.View>
      </View>

      {/* Contenu central (pourcentage) */}
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  clip: { position: 'absolute', top: 0, overflow: 'hidden' },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
});
