import AdContract from '../models/AdContract.js';
import fs from 'fs';
import path from 'path';

export const createAdContract = async (req, res) => {
  try {
    const { add_id, start_date, end_date } = req.body;
    const document_file = req.file ? req.file.filename : '';

    const newContract = new AdContract({
      add_id,
      start_date,
      end_date,
      document_file
    });

    const savedContract = await newContract.save();
    res.status(201).json(savedContract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllContracts = async (req, res) => {
  try {
    const contracts = await AdContract.find().populate('add_id');
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleContract = async (req, res) => {
  try {
    const contract = await AdContract.findById(req.params.id).populate('add_id');
    if (!contract) return res.status(404).json({ message: 'Contract not found' });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContract = async (req, res) => {
  try {
    const { add_id, start_date, end_date, status } = req.body;
    const updateData = { add_id, start_date, end_date, status };

    if (req.file) {
      // Delete old file if exists
      const oldContract = await AdContract.findById(req.params.id);
      if (oldContract.document_file) {
        const filePath = path.join('uploads/contracts/', oldContract.document_file);
        fs.unlinkSync(filePath);
      }
      updateData.document_file = req.file.filename;
    }

    const updatedContract = await AdContract.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true }
    );

    res.json(updatedContract);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteContract = async (req, res) => {
  try {
    const contract = await AdContract.findById(req.params.id);
    
    // Delete associated file
    if (contract.document_file) {
      const filePath = path.join('uploads/contracts/', contract.document_file);
      fs.unlinkSync(filePath);
    }

    await AdContract.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};