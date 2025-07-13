import './DemoFeature.css';

interface DemoFeatureProps {
  onDemoClick: () => void;
}

export default function DemoFeature({ onDemoClick }: DemoFeatureProps) {
  return (
    <div className="demo-feature">
      <div className="demo-content">
        <h4>🎯 Try the demo first!</h4>
        <p>Experience the conversion process with a sample Word document</p>
        <button className="demo-button" onClick={onDemoClick}>
          ✨ Run Demo
        </button>
      </div>
    </div>
  );
}