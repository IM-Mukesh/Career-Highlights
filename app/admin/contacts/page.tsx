"use client";
import { useEffect, useState } from "react";
import { Trash2, Mail, Phone, User, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact`
      );
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const deleteContact = async () => {
    if (!contactToDelete) return;

    setDeletingId(contactToDelete._id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contact/${contactToDelete._id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete contact");

      setContacts(
        contacts.filter((contact) => contact._id !== contactToDelete._id)
      );
      closeDeleteModal();
    } catch (err) {
      alert("Failed to delete contact");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-primary mb-2">
            Contact Submissions
          </h1>
          <p className="text-muted-foreground">
            Total submissions: {contacts.length}
          </p>
        </motion.div>

        {contacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground">
              No contact submissions yet
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {contact.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openDeleteModal(contact)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-md transition-colors"
                    title="Delete contact"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {contact.phone && (
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{contact.phone}</span>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-foreground leading-relaxed">
                    {contact.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(contact.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && contactToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeDeleteModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-lg p-6 max-w-md w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Delete Contact
                </h3>
                <button
                  onClick={closeDeleteModal}
                  className="p-1 hover:bg-muted rounded-md transition-colors"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-muted-foreground mb-2">
                  Are you sure you want to delete this contact submission?
                </p>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="font-medium text-foreground">
                    {contactToDelete.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {contactToDelete.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={deletingId === contactToDelete._id}
                >
                  Cancel
                </button>
                <button
                  onClick={deleteContact}
                  disabled={deletingId === contactToDelete._id}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {deletingId === contactToDelete._id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
