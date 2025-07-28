import React, { useState, useEffect } from 'react';
import { useNotes } from '../../context/NotesContext';

const NotesList = () => {
  const { notes, fetchNotes, createNote, updateNote, deleteNote, isLoading } = useNotes();
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingNote) {
      await updateNote(editingNote._id, formData);
    } else {
      await createNote(formData);
    }
    
    setFormData({ title: '', content: '' });
    setShowForm(false);
    setEditingNote(null);
    fetchNotes();
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({ title: note.title, content: note.content });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNote(null);
    setFormData({ title: '', content: '' });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>My Notes ({notes.length})</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          + New Note
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3>{editingNote ? 'Edit Note' : 'Create New Note'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Content:</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="form-control"
                rows="4"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>
              {editingNote ? 'Update Note' : 'Save Note'}
            </button>
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn"
              style={{ background: '#6c757d', color: 'white' }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {notes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {notes.map((note) => (
            <div key={note._id} className="card">
              <h4>{note.title}</h4>
              <p style={{ marginBottom: '10px' }}>{note.content}</p>
              <small style={{ color: '#666' }}>
                {new Date(note.createdAt).toLocaleDateString()}
              </small>
              <div style={{ marginTop: '10px' }}>
                <button 
                  onClick={() => handleEdit(note)}
                  style={{ 
                    background: '#28a745', 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteNote(note._id)}
                  style={{ 
                    background: '#dc3545', 
                    color: 'white', 
                    border: 'none', 
                    padding: '5px 10px', 
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;