import './Landing.css';
const Landing = () => {

  return (
    <section className="landing-bg min-vh-100 d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row justify-content-center align-items-start">
          <div className="col-md-6 px-5 text-start" style={{ marginTop: '1.5rem' }}>
            <div className="text-center">
              <h2 className="fw-semibold mb-3" style={{ color: '#043264' }}>
                Timestamp and protect your ideas with blockchain integrity.
              </h2>
            </div>
            <div className="text-start">
              <p className="lead fs-5 mb-4" style={{ color: '#043264' }}>
                TimeProof helps you prove ownership of your ideas, your work, or your creations by securely timestamping them on the blockchain. Submit any type of file (Text, PDF, Images, Code, etc) and receive verifiable, tamper-proof verification that you had it first, all without exposing the content publicly.
              </p>
            </div>
            <div className="d-flex justify-content-center gap-5">
              <a
                href="#submit"
                className="btn hover-white"
                style={{
                  backgroundColor: '#043264',
                  color: 'white',
                  border: '1px solid #043264',
                }}
              >
                Submit Idea
              </a>
              <a
                href="#verify"
                className="btn hover-white"
                style={{
                  backgroundColor: 'white',
                  color: '#043264',
                  border: '1px solid #043264',
                }}
              >
                Verify Idea
              </a>
            </div>
          </div>
          <div className="col-md-6 px-5" style={{ marginTop: '2rem' }}>
            <div style={{ height: '100%' }}>
              <div className="ratio ratio-16x9" style={{ height: '100%' }}>
                <iframe
                  src="https://www.youtube.com/embed/mg0vpigV284?si=E1fOULHiJDCWoEBW"
                  title="TimeProof Explainer"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;