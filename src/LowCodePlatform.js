import React, { useState, useRef } from 'react';
import { Plus, Trash2, Eye, Code, Save, Download, Layout, Type, Image, Square, Circle, Palette, Settings, Play } from 'lucide-react';

const LowCodePlatform = () => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [projectName, setProjectName] = useState('My Project');
  const [activeTab, setActiveTab] = useState('design');
  const [draggedComponent, setDraggedComponent] = useState(null);

  const componentTypes = [
    { type: 'heading', icon: Type, label: 'Heading', defaultProps: { text: 'Heading', size: 'h2', color: '#1a1a1a' } },
    { type: 'text', icon: Type, label: 'Text', defaultProps: { text: 'Your text here', color: '#333333' } },
    { type: 'button', icon: Square, label: 'Button', defaultProps: { text: 'Click Me', bgColor: '#6366f1', textColor: '#ffffff' } },
    { type: 'image', icon: Image, label: 'Image', defaultProps: { url: 'https://via.placeholder.com/300x200', alt: 'Image' } },
    { type: 'container', icon: Layout, label: 'Container', defaultProps: { bgColor: '#f3f4f6', padding: '20px' } },
    { type: 'circle', icon: Circle, label: 'Circle', defaultProps: { size: 100, color: '#8b5cf6' } },
  ];

  const addComponent = (type) => {
    const componentType = componentTypes.find(c => c.type === type);
    const newComponent = {
      id: Date.now(),
      type,
      props: { ...componentType.defaultProps },
      position: { x: 50, y: 50 + components.length * 120 }
    };
    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent.id);
  };

  const updateComponent = (id, updates) => {
    setComponents(components.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
  };

  const deleteComponent = (id) => {
    setComponents(components.filter(c => c.id !== id));
    setSelectedComponent(null);
  };

  const generateCode = () => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { position: relative; }
        .component { position: absolute; transition: all 0.3s ease; }
        .button:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.2); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .component { animation: fadeIn 0.5s ease; }
    </style>
</head>
<body>
    <div class="container">
${components.map(c => {
  const style = `left: ${c.position.x}px; top: ${c.position.y}px;`;
  
  switch(c.type) {
    case 'heading':
      return `        <${c.props.size} class="component" style="${style} color: ${c.props.color};">${c.props.text}</${c.props.size}>`;
    case 'text':
      return `        <p class="component" style="${style} color: ${c.props.color};">${c.props.text}</p>`;
    case 'button':
      return `        <button class="component button" style="${style} background: ${c.props.bgColor}; color: ${c.props.textColor}; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">${c.props.text}</button>`;
    case 'image':
      return `        <img class="component" style="${style} max-width: 300px; border-radius: 8px;" src="${c.props.url}" alt="${c.props.alt}">`;
    case 'container':
      return `        <div class="component" style="${style} background: ${c.props.bgColor}; padding: ${c.props.padding}; border-radius: 12px; min-width: 200px; min-height: 100px;"></div>`;
    case 'circle':
      return `        <div class="component" style="${style} width: ${c.props.size}px; height: ${c.props.size}px; background: ${c.props.color}; border-radius: 50%;"></div>`;
    default:
      return '';
  }
}).join('\n')}
    </div>
</body>
</html>`;
    return html;
  };

  const downloadCode = () => {
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.html`;
    a.click();
  };

  const renderComponent = (component) => {
    const isSelected = selectedComponent === component.id;
    const baseStyle = {
      position: 'absolute',
      left: component.position.x,
      top: component.position.y,
      cursor: 'move',
      border: isSelected ? '2px solid #6366f1' : '2px solid transparent',
      padding: '8px',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
    };

    const handleDragStart = (e) => {
      setDraggedComponent(component.id);
    };

    const handleDrag = (e) => {
      if (e.clientX === 0 && e.clientY === 0) return;
      const canvas = document.getElementById('canvas');
      const rect = canvas.getBoundingClientRect();
      updateComponent(component.id, {
        position: {
          x: e.clientX - rect.left - 50,
          y: e.clientY - rect.top - 20
        }
      });
    };

    const commonProps = {
      draggable: true,
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onClick: (e) => {
        e.stopPropagation();
        setSelectedComponent(component.id);
      },
      style: baseStyle
    };

    switch(component.type) {
      case 'heading':
        const HeadingTag = component.props.size;
        return <HeadingTag key={component.id} {...commonProps} style={{...baseStyle, color: component.props.color, margin: 0}}>{component.props.text}</HeadingTag>;
      case 'text':
        return <p key={component.id} {...commonProps} style={{...baseStyle, color: component.props.color}}>{component.props.text}</p>;
      case 'button':
        return <button key={component.id} {...commonProps} style={{...baseStyle, background: component.props.bgColor, color: component.props.textColor, padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px'}}>{component.props.text}</button>;
      case 'image':
        return <img key={component.id} {...commonProps} style={{...baseStyle, maxWidth: '300px', borderRadius: '8px'}} src={component.props.url} alt={component.props.alt} />;
      case 'container':
        return <div key={component.id} {...commonProps} style={{...baseStyle, background: component.props.bgColor, padding: component.props.padding, borderRadius: '12px', minWidth: '200px', minHeight: '100px'}}></div>;
      case 'circle':
        return <div key={component.id} {...commonProps} style={{...baseStyle, width: component.props.size, height: component.props.size, background: component.props.color, borderRadius: '50%'}}></div>;
      default:
        return null;
    }
  };

  const selectedComp = components.find(c => c.id === selectedComponent);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Left Sidebar - Component Library */}
      <div style={{ width: '280px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '24px', boxShadow: '4px 0 24px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={{ width: '100%', padding: '12px', fontSize: '18px', fontWeight: 'bold', border: '2px solid #e5e7eb', borderRadius: '8px', background: 'white' }}
          />
        </div>

        <h3 style={{ marginBottom: '16px', color: '#1f2937', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Components</h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {componentTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => addComponent(type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.background = '#f0f9ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.background = 'white';
              }}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={() => setShowCode(!showCode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Code size={18} />
            {showCode ? 'Hide Code' : 'View Code'}
          </button>

          <button
            onClick={downloadCode}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '14px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('design')}
              style={{
                padding: '8px 20px',
                background: activeTab === 'design' ? '#6366f1' : 'transparent',
                color: activeTab === 'design' ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              Design
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              style={{
                padding: '8px 20px',
                background: activeTab === 'preview' ? '#6366f1' : 'transparent',
                color: activeTab === 'preview' ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              <Play size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Preview
            </button>
          </div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>
            {components.length} component{components.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Canvas Area */}
          <div
            id="canvas"
            onClick={() => setSelectedComponent(null)}
            style={{
              flex: 1,
              position: 'relative',
              background: showCode ? '#1e293b' : 'white',
              margin: '24px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'auto'
            }}
          >
            {showCode ? (
              <pre style={{ padding: '24px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace', lineHeight: '1.6', margin: 0 }}>
                {generateCode()}
              </pre>
            ) : (
              <>
                {components.length === 0 && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: '18px'
                  }}>
                    <Layout size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <div>Start by adding components from the left panel</div>
                  </div>
                )}
                {components.map(component => renderComponent(component))}
              </>
            )}
          </div>

          {/* Right Sidebar - Properties */}
          {selectedComp && !showCode && (
            <div style={{ width: '300px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '24px', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Properties</h3>
                <button
                  onClick={() => deleteComponent(selectedComp.id)}
                  style={{
                    padding: '8px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fecaca'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#fee2e2'}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedComp.type === 'heading' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Text</label>
                      <input
                        type="text"
                        value={selectedComp.props.text}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, text: e.target.value }})}
                        style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Size</label>
                      <select
                        value={selectedComp.props.size}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, size: e.target.value }})}
                        style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                      >
                        <option value="h1">H1</option>
                        <option value="h2">H2</option>
                        <option value="h3">H3</option>
                        <option value="h4">H4</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Color</label>
                      <input
                        type="color"
                        value={selectedComp.props.color}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, color: e.target.value }})}
                        style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}
                      />
                    </div>
                  </>
                )}

                {selectedComp.type === 'text' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Text</label>
                      <textarea
                        value={selectedComp.props.text}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, text: e.target.value }})}
                        style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Color</label>
                      <input
                        type="color"
                        value={selectedComp.props.color}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, color: e.target.value }})}
                        style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}
                      />
                    </div>
                  </>
                )}

                {selectedComp.type === 'button' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Button Text</label>
                      <input
                        type="text"
                        value={selectedComp.props.text}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, text: e.target.value }})}
                        style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Background Color</label>
                      <input
                        type="color"
                        value={selectedComp.props.bgColor}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, bgColor: e.target.value }})}
                        style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Text Color</label>
                      <input
                        type="color"
                        value={selectedComp.props.textColor}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, textColor: e.target.value }})}
                        style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}
                      />
                    </div>
                  </>
                )}

                {selectedComp.type === 'image' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Image URL</label>
                      <input
                        type="text"
                        value={selectedComp.props.url}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, url: e.target.value }})}
                        style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Alt Text</label>
                      <input
                        type="text"
                        value={selectedComp.props.alt}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, alt: e.target.value }})}
                        style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </>
                )}

                {selectedComp.type === 'container' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Background Color</label>
                      <input
                        type="color"
                        value={selectedComp.props.bgColor}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, bgColor: e.target.value }})}
                        style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Padding</label>
                      <input
                        type="text"
                        value={selectedComp.props.padding}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, padding: e.target.value }})}
                        style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                        placeholder="20px"
                      />
                    </div>
                  </>
                )}

                {selectedComp.type === 'circle' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Size</label>
                      <input
                        type="number"
                        value={selectedComp.props.size}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, size: parseInt(e.target.value) }})}
                        style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Color</label>
                      <input
                        type="color"
                        value={selectedComp.props.color}
                        onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, color: e.target.value }})}
                        style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer' }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LowCodePlatform;