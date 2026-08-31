import { CategoryCard } from '../components/CategoryCard.jsx';
import { useOrbit } from '../store/OrbitProvider.jsx';

export function Categories() {
  const { c, layout, CATEGORIES, countByCategory } = useOrbit();

  return (
    <section
      data-screen-label="Categories"
      style={{
        maxWidth: 1160,
        margin: '0 auto',
        padding: layout.pagePad,
        animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <h1 style={{ fontSize: 32, margin: '0 0 8px' }}>Categories</h1>
      <p
        style={{
          color: c.ink(0.6),
          fontSize: 14,
          margin: '0 0 32px',
          maxWidth: 560,
        }}
      >
        Browse the AI ecosystem by what you&apos;re trying to do — from coding and design to sales
        and support.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${layout.categoriesGridCols},1fr)`,
          gap: 16,
        }}
      >
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.id} category={cat} count={countByCategory[cat.id] || 0} />
        ))}
      </div>
    </section>
  );
}

export default Categories;
