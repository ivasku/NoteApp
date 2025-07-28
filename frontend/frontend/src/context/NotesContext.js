import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { notesAPI } from '../services/api';

// Initial state
const initialState = {
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
    important: false
  },
  pagination: {
    current: 1,
    pages: 1,
    total: 0
  },
  stats: {
    totalNotes: 0,
    importantNotes: 0,
    categories: []
  }
};

// Action types
const NOTES_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTES: 'SET_NOTES',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  SET_CURRENT_NOTE: 'SET_CURRENT_NOTE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_FILTERS: 'SET_FILTERS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_STATS: 'SET_STATS'
};

// Reducer
const notesReducer = (state, action) => {
  switch (action.type) {
    case NOTES_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case NOTES_ACTIONS.SET_NOTES:
      return {
        ...state,
        notes: action.payload,
        isLoading: false,
        error: null
      };

    case NOTES_ACTIONS.ADD_NOTE:
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        error: null
      };

    case NOTES_ACTIONS.UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes.map(note =>
          note._id === action.payload._id ? action.payload : note
        ),
        currentNote: state.currentNote?._id === action.payload._id 
          ? action.payload 
          : state.currentNote,
        error: null
      };

    case NOTES_ACTIONS.DELETE_NOTE:
      return {
        ...state,
        notes: state.notes.filter(note => note._id !== action.payload),
        currentNote: state.currentNote?._id === action.payload 
          ? null 
          : state.currentNote,
        error: null
      };

    case NOTES_ACTIONS.SET_CURRENT_NOTE:
      return {
        ...state,
        currentNote: action.payload
      };

    case NOTES_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case NOTES_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case NOTES_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    case NOTES_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: action.payload
      };

    case NOTES_ACTIONS.SET_STATS:
      return {
        ...state,
        stats: action.payload
      };

    default:
      return state;
  }
};

// Create context
const NotesContext = createContext();

// Custom hook to use notes context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

// Notes Provider component
export const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // Fetch all notes
  const fetchNotes = useCallback(async (filters = {}) => {
    try {
      dispatch({ type: NOTES_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });

      const response = await notesAPI.getAllNotes({
        ...state.filters,
        ...filters
      });

      dispatch({
        type: NOTES_ACTIONS.SET_NOTES,
        payload: response.data.notes
      });

      dispatch({
        type: NOTES_ACTIONS.SET_PAGINATION,
        payload: response.data.pagination
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch notes';
      dispatch({
        type: NOTES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
    }
  }, [state.filters]);

  // Fetch single note
  const fetchNoteById = async (id) => {
    try {
      dispatch({ type: NOTES_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });

      const response = await notesAPI.getNoteById(id);
      
      dispatch({
        type: NOTES_ACTIONS.SET_CURRENT_NOTE,
        payload: response.data.note
      });

      dispatch({ type: NOTES_ACTIONS.SET_LOADING, payload: false });
      return { success: true, data: response.data.note };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch note';
      dispatch({
        type: NOTES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Create note
  const createNote = async (noteData) => {
    try {
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });

      const response = await notesAPI.createNote(noteData);

      dispatch({
        type: NOTES_ACTIONS.ADD_NOTE,
        payload: response.data.note
      });

      // Refresh stats
      fetchStats();

      return { success: true, data: response.data.note };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create note';
      dispatch({
        type: NOTES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Update note
  const updateNote = async (id, noteData) => {
    try {
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });

      const response = await notesAPI.updateNote(id, noteData);

      dispatch({
        type: NOTES_ACTIONS.UPDATE_NOTE,
        payload: response.data.note
      });

      // Refresh stats
      fetchStats();

      return { success: true, data: response.data.note };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update note';
      dispatch({
        type: NOTES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });

      await notesAPI.deleteNote(id);

      dispatch({
        type: NOTES_ACTIONS.DELETE_NOTE,
        payload: id
      });

      // Refresh stats
      fetchStats();

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete note';
      dispatch({
        type: NOTES_ACTIONS.SET_ERROR,
        payload: errorMessage
      });
      return { success: false, error: errorMessage };
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await notesAPI.getNotesStats();
      dispatch({
        type: NOTES_ACTIONS.SET_STATS,
        payload: response.data
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({
      type: NOTES_ACTIONS.SET_FILTERS,
      payload: filters
    });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: NOTES_ACTIONS.CLEAR_ERROR });
  };

  // Set current note
  const setCurrentNote = (note) => {
    dispatch({
      type: NOTES_ACTIONS.SET_CURRENT_NOTE,
      payload: note
    });
  };

  const value = {
    // State
    notes: state.notes,
    currentNote: state.currentNote,
    isLoading: state.isLoading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    stats: state.stats,

    // Actions
    fetchNotes,
    fetchNoteById,
    createNote,
    updateNote,
    deleteNote,
    fetchStats,
    setFilters,
    clearError,
    setCurrentNote
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};