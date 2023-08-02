function PackagePreview({ courseUrl }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        padding: '1rem',
      }}
    >
      <iframe src={courseUrl} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default PackagePreview;
