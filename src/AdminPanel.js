import React, { useState, useEffect } from 'react';
import { db } from './firebase-config';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Button, Form, Modal, Table, Alert, Container } from 'react-bootstrap';

const AdminPanel = () => {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]); // Filtered list of songs
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [newSong, setNewSong] = useState({ url: '', pjevač: '', pjesma: '', pitanje: '', odgovor: '' });
  const [showModal, setShowModal] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [error, setError] = useState('');

  // Fetch songs from Firebase in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'songs'), (snapshot) => {
      const songsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSongs(songsList);
      setFilteredSongs(songsList); // Initialize filtered list
    });

    return () => unsubscribe();
  }, []);

  // Filter songs when search term changes
  useEffect(() => {
    const filtered = songs.filter((song) =>
      song.pjevač.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.pjesma.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.pitanje.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.odgovor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSongs(filtered);
  }, [searchTerm, songs]);

  // Handle adding a new song
  const handleAddSong = async () => {
    try {
      if (!newSong.url || !newSong.pjevač || !newSong.pjesma || !newSong.pitanje || !newSong.odgovor) {
        setError('Molimo popunite sva polja.');
        return;
      }
      await addDoc(collection(db, 'songs'), newSong);
      setNewSong({ url: '', pjevač: '', pjesma: '', pitanje: '', odgovor: '' });
      setShowModal(false);
      setError('');
    } catch (error) {
      setError('Greška prilikom dodavanja.');
    }
  };

  // Handle deleting a song
  const handleDeleteSong = async (id) => {
    try {
      await deleteDoc(doc(db, 'songs', id));
    } catch (error) {
      setError('Greška prilikom brisanja.');
    }
  };

  // Handle editing a song
  const handleEditSong = async () => {
    try {
      const songRef = doc(db, 'songs', editingSong.id);
      await updateDoc(songRef, editingSong);
      setEditingSong(null);
      setError('');
    } catch (error) {
      setError('Greška prilikom ažuriranja.');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Admin Panel</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Search input */}
      <Form.Control
        type="text"
        placeholder="Pretraži po pjevaču, pjesmi, pitanju ili odgovoru"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      {/* Button to show the modal for adding new song */}
      <Button onClick={() => setShowModal(true)} variant="primary" className="mb-4">
        Dodaj novo
      </Button>

      {/* Songs Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th> 
            <th>Pjevač</th>
            <th>Pjesma</th>
            <th>Pitanje</th>
            <th>Odgovor</th>
            <th>URL</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
        {filteredSongs.map((song, index) => (
      <tr key={song.id}>
        <td>{index + 1}</td> {/* Dodano za redni broj */}
              <td>{song.pjevač}</td>
              <td>{song.pjesma}</td>
              <td>{song.pitanje}</td>
              <td>{song.odgovor}</td>
              <td><a href={song.url} target="_blank" rel="noopener noreferrer">{song.url}</a></td>
              <td>
                <Button variant="warning" onClick={() => setEditingSong(song)} className="me-2">Uredi</Button>
                <Button variant="danger" onClick={() => handleDeleteSong(song.id)}>Obriši</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for adding new song */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dodaj novo pitanje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSongURL" className="mb-3">
              <Form.Label>URL</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter song URL"
                value={newSong.url} 
                onChange={(e) => setNewSong({ ...newSong, url: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formArtist" className="mb-3">
              <Form.Label>Pjevač</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter artist"
                value={newSong.pjevač} 
                onChange={(e) => setNewSong({ ...newSong, pjevač: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formSongName" className="mb-3">
              <Form.Label>Pjesma</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter song name"
                value={newSong.pjesma} 
                onChange={(e) => setNewSong({ ...newSong, pjesma: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formQuestion" className="mb-3">
              <Form.Label>Pitanje</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter question"
                value={newSong.pitanje} 
                onChange={(e) => setNewSong({ ...newSong, pitanje: e.target.value })} 
              />
            </Form.Group>
            <Form.Group controlId="formAnswer" className="mb-3">
              <Form.Label>Odgovor</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter answer"
                value={newSong.odgovor} 
                onChange={(e) => setNewSong({ ...newSong, odgovor: e.target.value })} 
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddSong}>
              Dodaj
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for editing an existing song */}
      {editingSong && (
        <Modal show={true} onHide={() => setEditingSong(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Uredi pitanje</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formSongURL" className="mb-3">
                <Form.Label>URL</Form.Label>
                <Form.Control 
                  type="text" 
                  value={editingSong.url} 
                  onChange={(e) => setEditingSong({ ...editingSong, url: e.target.value })} 
                />
              </Form.Group>
              <Form.Group controlId="formArtist" className="mb-3">
                <Form.Label>Pjevač</Form.Label>
                <Form.Control 
                  type="text" 
                  value={editingSong.pjevač} 
                  onChange={(e) => setEditingSong({ ...editingSong, pjevač: e.target.value })} 
                />
              </Form.Group>
              <Form.Group controlId="formSongName" className="mb-3">
                <Form.Label>Pjesma</Form.Label>
                <Form.Control 
                  type="text" 
                  value={editingSong.pjesma} 
                  onChange={(e) => setEditingSong({ ...editingSong, pjesma: e.target.value })} 
                />
              </Form.Group>
              <Form.Group controlId="formQuestion" className="mb-3">
                <Form.Label>Pitanje</Form.Label>
                <Form.Control 
                  type="text" 
                  value={editingSong.pitanje} 
                  onChange={(e) => setEditingSong({ ...editingSong, pitanje: e.target.value })} 
                />
              </Form.Group>
              <Form.Group controlId="formAnswer" className="mb-3">
                <Form.Label>Odgovor</Form.Label>
                <Form.Control 
                  type="text" 
                  value={editingSong.odgovor} 
                  onChange={(e) => setEditingSong({ ...editingSong, odgovor: e.target.value })} 
                />
              </Form.Group>
              <Button variant="primary" onClick={handleEditSong}>
                Sačuvaj
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default AdminPanel;


