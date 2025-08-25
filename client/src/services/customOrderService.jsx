// services/customOrderService.js
import { db, storage } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const createCustomOrder = async (orderData) => {
  try {
    let imageUrl = null;
    
    // Upload image if provided
    if (orderData.referenceImage) {
      const imageRef = ref(storage, `custom-orders/${Date.now()}_${orderData.referenceImage.name}`);
      const snapshot = await uploadBytes(imageRef, orderData.referenceImage);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
    
    // Remove the file object before storing in Firestore
    const { referenceImage, ...orderDataWithoutFile } = orderData;
    
    const docRef = await addDoc(collection(db, "customOrders"), {
      ...orderDataWithoutFile,
      imageUrl,
      createdAt: new Date(),
      status: 'pending',
      orderType: 'custom'
    });
    
    return { id: docRef.id, ...orderDataWithoutFile, imageUrl };
  } catch (error) {
    console.error("Error adding custom order: ", error);
    throw error;
  }
};

export const getCustomOrdersByUser = async (userId) => {
  try {
    const q = query(
      collection(db, "customOrders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting custom orders: ", error);
    throw error;
  }
};

export const getAllCustomOrders = async () => {
  try {
    const q = query(
      collection(db, "customOrders"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all custom orders: ", error);
    throw error;
  }
};

export const updateCustomOrderStatus = async (orderId, status) => {
  try {
    await updateDoc(doc(db, "customOrders", orderId), { 
      status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating custom order: ", error);
    throw error;
  }
};
