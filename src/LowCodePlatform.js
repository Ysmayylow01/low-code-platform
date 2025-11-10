import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Code, Download, Layout, Type, Image, Square, Circle, Copy, Undo, Redo, Grid, Smartphone, Monitor, Tablet, AlignLeft, AlignCenter, AlignRight, Link, List, CheckSquare, Moon, Sun } from 'lucide-react';

const LowCodePlatform = () => {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [projectName, setProjectName] = useState('My Project');
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewport, setViewport] = useState('desktop');
  const [showGrid, setShowGrid] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [copiedComponent, setCopiedComponent] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const componentTypes = [
    { type: 'heading', icon: Type, label: 'Heading', defaultProps: { text: 'Heading', size: 'h2', color: '#1a1a1a', align: 'left' } },
    { type: 'text', icon: Type, label: 'Paragraph', defaultProps: { text: 'Your text here', color: '#333333', align: 'left' } },
    { type: 'button', icon: Square, label: 'Button', defaultProps: { text: 'Click Me', bgColor: '#6366f1', textColor: '#ffffff' } },
    { type: 'image', icon: Image, label: 'Image', defaultProps: { url: 'https://via.placeholder.com/300x200', alt: 'Image' } },
    { type: 'container', icon: Layout, label: 'Container', defaultProps: { bgColor: '#f3f4f6', width: '300px', height: '200px' } },
    { type: 'circle', icon: Circle, label: 'Circle', defaultProps: { size: 100, color: '#8b5cf6' } },
    { type: 'input', icon: Type, label: 'Input', defaultProps: { placeholder: 'Enter text...' } },
    { type: 'link', icon: Link, label: 'Link', defaultProps: { text: 'Click here', url: '#', color: '#6366f1' } },
    { type: 'list', icon: List, label: 'List', defaultProps: { items: ['Item 1', 'Item 2', 'Item 3'], type: 'ul' } },
  ];

  const showNotif = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const addToHistory = (newComponents) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newComponents);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const addComponent = (type) => {
    const componentType = componentTypes.find(c => c.type === type);
    const newComponent = {
      id: Date.now(),
      type,
      props: { ...componentType.defaultProps },
      position: { x: 50, y: 50 + components.length * 80 }
    };
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    addToHistory(newComponents);
    setSelectedComponent(newComponent.id);
    showNotif(`${componentType.label} added`);
  };

  const updateComponent = (id, updates) => {
    const newComponents = components.map(c => 
      c.id === id ? { ...c, ...updates } : c
    );
    setComponents(newComponents);
    addToHistory(newComponents);
  };

  const deleteComponent = (id) => {
    const newComponents = components.filter(c => c.id !== id);
    setComponents(newComponents);
    addToHistory(newComponents);
    setSelectedComponent(null);
    showNotif('Component deleted');
  };

  const duplicateComponent = (component) => {
    const newComponent = {
      ...component,
      id: Date.now(),
      position: { x: component.position.x + 20, y: component.position.y + 20 }
    };
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    addToHistory(newComponents);
    showNotif('Component duplicated');
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents(history[historyIndex - 1]);
      showNotif('Undo');
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents(history[historyIndex + 1]);
      showNotif('Redo');
    }
  };

  const copyComponent = (component) => {
    setCopiedComponent(component);
    showNotif('Component copied');
  };

  const pasteComponent = () => {
    if (copiedComponent) {
      const newComponent = {
        ...copiedComponent,
        id: Date.now(),
        position: { x: copiedComponent.position.x + 30, y: copiedComponent.position.y + 30 }
      };
      const newComponents = [...components, newComponent];
      setComponents(newComponents);
      addToHistory(newComponents);
      showNotif('Component pasted');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedComponent) {
        e.preventDefault();
        const comp = components.find(c => c.id === selectedComponent);
        if (comp) copyComponent(comp);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v' && copiedComponent) {
        e.preventDefault();
        pasteComponent();
      }
      if (e.key === 'Delete' && selectedComponent) {
        e.preventDefault();
        deleteComponent(selectedComponent);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponent, historyIndex, components, copiedComponent]);

  const generateCode = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: system-ui, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { position: relative; max-width: 1200px; margin: 0 auto; }
        .component { position: absolute; transition: all 0.3s ease; }
        button:hover { transform: translateY(-2px); }
    </style>
</head>
<body>
    <div class="container">
${components.map(c => {
  const style = `left: ${c.position.x}px; top: ${c.position.y}px;`;
  switch(c.type) {
    case 'heading':
      return `        <${c.props.size} class="component" style="${style} color: ${c.props.color}; text-align: ${c.props.align};">${c.props.text}</${c.props.size}>`;
    case 'text':
      return `        <p class="component" style="${style} color: ${c.props.color}; text-align: ${c.props.align};">${c.props.text}</p>`;
    case 'button':
      return `        <button class="component" style="${style} background: ${c.props.bgColor}; color: ${c.props.textColor}; padding: 12px 24px; border: none; border-radius: 8px; cursor: pointer;">${c.props.text}</button>`;
    case 'image':
      return `        <img class="component" style="${style} max-width: 300px; border-radius: 8px;" src="${c.props.url}" alt="${c.props.alt}">`;
    case 'container':
      return `        <div class="component" style="${style} background: ${c.props.bgColor}; width: ${c.props.width}; height: ${c.props.height}; border-radius: 12px;"></div>`;
    case 'circle':
      return `        <div class="component" style="${style} width: ${c.props.size}px; height: ${c.props.size}px; background: ${c.props.color}; border-radius: 50%;"></div>`;
    case 'input':
      return `        <input type="text" class="component" style="${style} padding: 12px; border: 2px solid #ddd; border-radius: 8px;" placeholder="${c.props.placeholder}">`;
    case 'link':
      return `        <a href="${c.props.url}" class="component" style="${style} color: ${c.props.color};">${c.props.text}</a>`;
    case 'list':
      const items = c.props.items.map(item => `<li>${item}</li>`).join('');
      return `        <${c.props.type} class="component" style="${style}">${items}</${c.props.type}>`;
    default:
      return '';
  }
}).join('\n')}
    </div>
</body>
</html>`;
  };

  const downloadCode = () => {
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '_')}.html`;
    a.click();
    showNotif('Downloaded!');
  };

  const getViewportWidth = () => {
    switch(viewport) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
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
      boxShadow: isSelected ? '0 0 0 4px rgba(99, 102, 241, 0.1)' : 'none'
    };

    const handleDrag = (e) => {
      if (e.clientX === 0 && e.clientY === 0) return;
      const canvas = document.getElementById('canvas');
      const rect = canvas.getBoundingClientRect();
      updateComponent(component.id, {
        position: {
          x: Math.max(0, e.clientX - rect.left - 50),
          y: Math.max(0, e.clientY - rect.top - 20)
        }
      });
    };

    const commonProps = {
      draggable: true,
      onDrag: handleDrag,
      onClick: (e) => {
        e.stopPropagation();
        setSelectedComponent(component.id);
      },
      onDoubleClick: (e) => {
        e.stopPropagation();
        duplicateComponent(component);
      },
      style: baseStyle
    };

    switch(component.type) {
      case 'heading':
        const HeadingTag = component.props.size;
        return React.createElement(HeadingTag, { key: component.id, ...commonProps, style: {...baseStyle, color: component.props.color, textAlign: component.props.align, margin: 0} }, component.props.text);
      case 'text':
        return <p key={component.id} {...commonProps} style={{...baseStyle, color: component.props.color, textAlign: component.props.align}}>{component.props.text}</p>;
      case 'button':
        return <button key={component.id} {...commonProps} style={{...baseStyle, background: component.props.bgColor, color: component.props.textColor, padding: '12px 24px', border: 'none', borderRadius: '8px'}}>{component.props.text}</button>;
      case 'image':
        return <img key={component.id} {...commonProps} style={{...baseStyle, maxWidth: '300px', borderRadius: '8px'}} src={component.props.url} alt={component.props.alt} />;
      case 'container':
        return <div key={component.id} {...commonProps} style={{...baseStyle, background: component.props.bgColor, width: component.props.width, height: component.props.height, borderRadius: '12px'}}></div>;
      case 'circle':
        return <div key={component.id} {...commonProps} style={{...baseStyle, width: component.props.size, height: component.props.size, background: component.props.color, borderRadius: '50%'}}></div>;
      case 'input':
        return <input key={component.id} type="text" {...commonProps} placeholder={component.props.placeholder} style={{...baseStyle, padding: '12px', border: '2px solid #ddd', borderRadius: '8px'}} />;
      case 'link':
        return <a key={component.id} href={component.props.url} {...commonProps} style={{...baseStyle, color: component.props.color}}>{component.props.text}</a>;
      case 'list':
        const ListTag = component.props.type;
        return React.createElement(ListTag, { key: component.id, ...commonProps, style: {...baseStyle, paddingLeft: '20px'} }, component.props.items.map((item, i) => <li key={i}>{item}</li>));
      default:
        return null;
    }
  };

  const selectedComp = components.find(c => c.id === selectedComponent);

  return (
    <div style={{ display: 'flex', height: '100vh', background: darkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: 'system-ui, sans-serif' }}>
      {showNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 10000
        }}>
          {notificationMessage}
        </div>
      )}

      <div style={{ width: '280px', background: darkMode ? 'rgba(30, 30, 46, 0.95)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '24px', boxShadow: '4px 0 24px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            style={{ width: '100%', padding: '12px', fontSize: '18px', fontWeight: 'bold', border: '2px solid #e5e7eb', borderRadius: '8px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              flex: 1,
              padding: '10px',
              background: darkMode ? '#6366f1' : '#f3f4f6',
              color: darkMode ? 'white' : '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setShowGrid(!showGrid)}
            style={{
              flex: 1,
              padding: '10px',
              background: showGrid ? '#6366f1' : '#f3f4f6',
              color: showGrid ? 'white' : '#374151',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <Grid size={16} />
          </button>
        </div>

        <h3 style={{ marginBottom: '16px', color: darkMode ? '#e5e7eb' : '#1f2937', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Components</h3>
        <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
          {componentTypes.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => addComponent(type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: darkMode ? '#2a2a3e' : 'white',
                border: `2px solid ${darkMode ? '#3a3a4e' : '#e5e7eb'}`,
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: darkMode ? '#e5e7eb' : '#374151'
              }}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        <h3 style={{ marginBottom: '16px', color: darkMode ? '#e5e7eb' : '#1f2937', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
              fontWeight: '600'
            }}
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
              fontWeight: '600'
            }}
          >
            <Download size={18} />
            Download
          </button>
        </div>

        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', fontSize: '12px', color: darkMode ? '#a5b4fc' : '#4f46e5' }}>
          <strong>Shortcuts:</strong><br/>
          Ctrl+Z: Undo<br/>
          Ctrl+Y: Redo<br/>
          Ctrl+C: Copy<br/>
          Ctrl+V: Paste<br/>
          Del: Delete<br/>
          Double-click: Duplicate
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: darkMode ? 'rgba(30, 30, 46, 0.95)' : 'rgba(255,255,255,0.95)', padding: '16px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={undo} disabled={historyIndex === 0} style={{ padding: '8px 12px', background: darkMode ? '#3a3a4e' : 'white', color: darkMode ? '#e5e7eb' : '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <Undo size={16} />
            </button>
            <button onClick={redo} disabled={historyIndex === history.length - 1} style={{ padding: '8px 12px', background: darkMode ? '#3a3a4e' : 'white', color: darkMode ? '#e5e7eb' : '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <Redo size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setViewport('mobile')} style={{ padding: '8px', background: viewport === 'mobile' ? '#6366f1' : 'transparent', color: viewport === 'mobile' ? 'white' : '#6b7280', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <Smartphone size={16} />
            </button>
            <button onClick={() => setViewport('tablet')} style={{ padding: '8px', background: viewport === 'tablet' ? '#6366f1' : 'transparent', color: viewport === 'tablet' ? 'white' : '#6b7280', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <Tablet size={16} />
            </button>
            <button onClick={() => setViewport('desktop')} style={{ padding: '8px', background: viewport === 'desktop' ? '#6366f1' : 'transparent', color: viewport === 'desktop' ? 'white' : '#6b7280', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <Monitor size={16} />
            </button>
            <select value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ padding: '8px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100%</option>
              <option value={125}>125%</option>
              <option value={150}>150%</option>
            </select>
          </div>

          <div style={{ color: darkMode ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>
            {components.length} components
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div
            id="canvas"
            onClick={() => setSelectedComponent(null)}
            style={{
              flex: 1,
              position: 'relative',
              background: showCode ? '#1e293b' : (darkMode ? '#16213e' : 'white'),
              backgroundImage: showGrid && !showCode ? `linear-gradient(${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px), linear-gradient(90deg, ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} 1px, transparent 1px)` : 'none',
              backgroundSize: '20px 20px',
              margin: '24px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'auto',
              maxWidth: getViewportWidth(),
              marginLeft: 'auto',
              marginRight: 'auto',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center'
            }}
          >
            {showCode ? (
              <pre style={{ padding: '24px', color: '#e2e8f0', fontSize: '13px', fontFamily: 'monospace', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                {generateCode()}
              </pre>
            ) : (
              <>
                {components.length === 0 && (
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: '#9ca3af', fontSize: '18px' }}>
                    <Layout size={64} style={{ marginBottom: '16px', opacity: 0.3 }} />
                    <div>Add components to get started</div>
                  </div>
                )}
                {components.map(component => renderComponent(component))}
              </>
            )}
          </div>

          {selectedComp && !showCode && (
            <div style={{ width: '300px', background: darkMode ? 'rgba(30, 30, 46, 0.95)' : 'rgba(255,255,255,0.95)', padding: '24px', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: darkMode ? '#e5e7eb' : '#1f2937' }}>Properties</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => copyComponent(selectedComp)} style={{ padding: '8px', background: darkMode ? '#3a3a4e' : '#f0f9ff', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    <Copy size={18} />
                  </button>
                  <button onClick={() => deleteComponent(selectedComp.id)} style={{ padding: '8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>X Position</label>
                  <input type="number" value={selectedComp.position.x} onChange={(e) => updateComponent(selectedComp.id, { position: { ...selectedComp.position, x: Number(e.target.value) }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Y Position</label>
                  <input type="number" value={selectedComp.position.y} onChange={(e) => updateComponent(selectedComp.id, { position: { ...selectedComp.position, y: Number(e.target.value) }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                </div>

                {selectedComp.type === 'heading' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Text</label>
                      <input type="text" value={selectedComp.props.text} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, text: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                    </div>
                    <div>
                      <select value={selectedComp.props.size} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, size: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }}>
                        <option value="h1">H1</option>
                        <option value="h2">H2</option>
                        <option value="h3">H3</option>
                        <option value="h4">H4</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Color</label>
                      <input type="color" value={selectedComp.props.color} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, color: e.target.value }})} style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                  </>
                )}

                {selectedComp.type === 'text' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Text</label>
                      <textarea value={selectedComp.props.text} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, text: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', minHeight: '80px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Color</label>
                      <input type="color" value={selectedComp.props.color} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, color: e.target.value }})} style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                  </>
                )}

                {selectedComp.type === 'button' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Text</label>
                      <input type="text" value={selectedComp.props.text} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, text: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Background</label>
                      <input type="color" value={selectedComp.props.bgColor} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, bgColor: e.target.value }})} style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Text Color</label>
                      <input type="color" value={selectedComp.props.textColor} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, textColor: e.target.value }})} style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                  </>
                )}

                {selectedComp.type === 'image' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Image URL</label>
                      <input type="text" value={selectedComp.props.url} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, url: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                    </div>
                  </>
                )}

                {selectedComp.type === 'container' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Background</label>
                      <input type="color" value={selectedComp.props.bgColor} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, bgColor: e.target.value }})} style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Width</label>
                      <input type="text" value={selectedComp.props.width} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, width: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Height</label>
                      <input type="text" value={selectedComp.props.height} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, height: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                    </div>
                  </>
                )}

                {selectedComp.type === 'circle' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Size</label>
                      <input type="number" value={selectedComp.props.size} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, size: parseInt(e.target.value) }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Color</label>
                      <input type="color" value={selectedComp.props.color} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, color: e.target.value }})} style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                  </>
                )}

                {selectedComp.type === 'input' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Placeholder</label>
                      <input type="text" value={selectedComp.props.placeholder} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, placeholder: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                    </div>
                  </>
                )}

                {selectedComp.type === 'link' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Text</label>
                      <input type="text" value={selectedComp.props.text} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, text: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>URL</label>
                      <input type="text" value={selectedComp.props.url} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, url: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Color</label>
                      <input type="color" value={selectedComp.props.color} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, color: e.target.value }})} style={{ width: '100%', height: '40px', border: '2px solid #e5e7eb', borderRadius: '6px', cursor: 'pointer' }} />
                    </div>
                  </>
                )}

                {selectedComp.type === 'list' && (
                  <>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Type</label>
                      <select value={selectedComp.props.type} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, type: e.target.value }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }}>
                        <option value="ul">Bullet List</option>
                        <option value="ol">Numbered List</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: darkMode ? '#e5e7eb' : '#374151' }}>Items (one per line)</label>
                      <textarea value={selectedComp.props.items.join('\n')} onChange={(e) => updateComponent(selectedComp.id, { props: { ...selectedComp.props, items: e.target.value.split('\n') }})} style={{ width: '100%', padding: '8px', border: '2px solid #e5e7eb', borderRadius: '6px', minHeight: '100px', background: darkMode ? '#2a2a3e' : 'white', color: darkMode ? '#e5e7eb' : '#1f2937' }} />
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