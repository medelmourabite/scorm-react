import React, { useLayoutEffect } from 'react';
import PackagePreview from './PackagePreview';

const SERVER_URL = 'http://localhost:3000';
const LMS_COMMIT_URL = `${SERVER_URL}/api/lms`;

const getScormScript = (props) => `
      console.log('LMS_INIT', ${JSON.stringify(props, null, 2)});
      var settings = {
        lmsCommitUrl: '${props.lmsCommitUrl}',
        requestHandler: function (data) {
          console.log('Parent: requestHandler', data);
          window.parent.API.setCMIValue("cmi.core.lesson_status", data.cmi.core.lesson_status);
          window.parent.API.lmsCommit();
          window.parent.API.terminate();
          window.postMessage(
            {
              type: 'COMMIT',
              data,
            },
            '*'
          );
        },
      };
      window.API = new Scorm12API(settings);
      if(!window.parent.API.isInitialized()) {
        window.parent.API.LMSInitialize();
      }
      window.API.replaceWithAnotherScormAPI(window.parent.API);
`;

const App = () => {
  const [courses, setCourses] = React.useState([]);
  const [childStatus, setChildStatus] = React.useState('unknown');
  const [step, setStep] = React.useState(0);
  const containerRef = React.useRef(null);

  const fetchCourses = async () => {
    const response = await fetch(`${SERVER_URL}/api/packages`);
    const data = await response.json();
    setCourses(data);
    console.log(data);
  };

  const initScormAgainScript = () => {
    const scormAgainScript = document.createElement('script');
    scormAgainScript.src =
      'https://cdn.jsdelivr.net/npm/scorm-again@1.7.1/dist/scorm-again.min.js';
    scormAgainScript.onload = () => {
      setTimeout(() => {
        console.log('scormAgainScript loaded');
        setStep(1);
      }, 1000);
    };
    containerRef.current.appendChild(scormAgainScript);
  };

  const initScript = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    const cmi = (window.API || window.parent.API)?.cmi?.toJSON();
    console.log('CMI', cmi);
    script.innerHTML = getScormScript({
      lmsCommitUrl: LMS_COMMIT_URL,
      cmi: cmi || {},
    });
    containerRef.current.appendChild(script);
    setTimeout(() => {
      console.log('script loaded');
      setStep(2);
    }, 1000);
  };
  useLayoutEffect(() => {
    if (step === 0) {
      initScormAgainScript();
      return;
    }
    if (step === 1) {
      initScript();
      return;
    }

    fetchCourses();

    window.addEventListener('message', (event) => {
      if (event.data.type === 'COMMIT') {
        const { data } = event.data;
        console.log('COMMIT', data);
        setChildStatus(data.cmi.core?.lesson_status);
      }
    });
  }, [step]);

  return (
    <div ref={containerRef} style={{ padding: '1rem' }}>
      <h2>PARENT scrom package</h2>
      <p>Child status: {childStatus}</p>
      {courses.map(({ id, entryPoint }) => (
        <PackagePreview
          key={id}
          courseUrl={`${SERVER_URL}/packages/${id}/${entryPoint}`}
        />
      ))}
    </div>
  );
};

export default App;
