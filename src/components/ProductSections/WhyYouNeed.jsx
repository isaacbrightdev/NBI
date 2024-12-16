const WhyYouNeed = () => {
  const sectionEl = document.querySelector('[data-component="why_you_need"]');

  if (!sectionEl) return null;

  const sectionText = sectionEl.dataset?.sectionText;

  return sectionText ? (
    <div className="mb-8 mt-2">
      <div className="product--overview">
        <div
          dangerouslySetInnerHTML={{
            __html: sectionText
          }}
        />
      </div>
    </div>
  ) : null;
};

export default WhyYouNeed;
