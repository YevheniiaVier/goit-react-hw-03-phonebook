import { Component } from 'react';
import shortid from 'shortid';
import { Container } from './App.styled';
import { ContactForm } from 'components/ContactForm/ContactForm';
import { ContactList } from 'components/ContactList/ContactList';
import { Filter } from 'components/Filter/Filter';
import { Title } from 'components/Title/Title';
import { Notification } from 'components/Notification/Notification';
import { Modal } from 'components/Modal/Modal';
import { Button } from 'components/ContactForm/Button';
import noContactImg from '../../images/no-contacts.png';

import initialContacts from '../../contacts.json';
import defaultUserImg from '../../images/default.png';

export class App extends Component {
  state = {
    contacts: initialContacts,
    filter: '',
    showModal: false,
  };

  componentDidMount() {
    const parsedContacts = JSON.parse(localStorage.getItem('contacts'));
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }
  componentDidUpdate(prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }
  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };
  addContact = ({ name, number, avatar }) => {
    const contact = {
      id: shortid.generate(),
      name,
      number,
      avatar: avatar ?? defaultUserImg,
    };
    this.setState(({ contacts }) => ({
      contacts: [...contacts, contact],
    }));
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };
  onClearBtnClick = () => {
    this.setState({ filter: '' });
  };

  changeFilter = e => {
    this.setState({ filter: e.currentTarget.value });
  };
  getFilteredContacts = () => {
    const { filter, contacts } = this.state;
    if (filter) {
      const normalizedFilter = filter.toLowerCase();
      return contacts.filter(contact =>
        contact.name.toLowerCase().includes(normalizedFilter)
      );
    }
    return contacts;
  };
  render() {
    const { contacts, filter, showModal } = this.state;
    const filteredContacts = this.getFilteredContacts();
    return (
      <Container>
        <Button onClick={this.toggleModal} type="button" text="Open Modal" />
        {showModal && (
          <Modal onClose={this.toggleModal}>
            <ContactForm actualContacts={contacts} onSubmit={this.addContact} />
            <Button onClick={this.toggleModal} text="Close" type="button" />
          </Modal>
        )}
        <Title text="Phonebook" />
        <Filter
          value={filter}
          onChange={this.changeFilter}
          onClear={this.onClearBtnClick}
        />
        <Title text="Contacts" />
        {contacts[0] ? (
          <ContactList
            contacts={filteredContacts}
            onDeleteContact={this.deleteContact}
          />
        ) : (
          <Notification
            text="There is no contact yet, you can add a new one!"
            imgPath={noContactImg}
          />
        )}
        {!filteredContacts[0] && contacts[0] && (
          <Notification text="No contact found" imgPath={noContactImg} />
        )}
      </Container>
    );
  }
}