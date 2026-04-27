import { useInView } from '@/hooks/use-animations';

export default function SectionDivider() {
  const ref = useInView();

  return (
    <div ref={ref} className="w-full py-0">
      <div className="section-divider anim-scale-in" />
    </div>
  );
}
