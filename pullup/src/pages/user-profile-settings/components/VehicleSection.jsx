import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const VehicleSection = ({ vehicleInfo, onUpdateVehicle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    make: vehicleInfo?.make || '',
    model: vehicleInfo?.model || '',
    year: vehicleInfo?.year || '',
    color: vehicleInfo?.color || '',
    licensePlate: vehicleInfo?.licensePlate || '',
    vehicleImage: vehicleInfo?.vehicleImage || '',
    insurance: vehicleInfo?.insurance || '',
    registration: vehicleInfo?.registration || ''
  });
  const [imagePreview, setImagePreview] = useState(vehicleInfo?.vehicleImage || '');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setImagePreview(imageUrl);
        setFormData(prev => ({
          ...prev,
          vehicleImage: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateVehicle(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      make: vehicleInfo?.make || '',
      model: vehicleInfo?.model || '',
      year: vehicleInfo?.year || '',
      color: vehicleInfo?.color || '',
      licensePlate: vehicleInfo?.licensePlate || '',
      vehicleImage: vehicleInfo?.vehicleImage || '',
      insurance: vehicleInfo?.insurance || '',
      registration: vehicleInfo?.registration || ''
    });
    setImagePreview(vehicleInfo?.vehicleImage || '');
    setIsEditing(false);
  };

  const documentStatus = [
    {
      name: 'Vehicle Registration',
      status: 'verified',
      icon: 'FileText',
      color: 'success'
    },
    {
      name: 'Insurance Certificate',
      status: 'verified',
      icon: 'Shield',
      color: 'success'
    },
    {
      name: 'Driver License',
      status: 'pending',
      icon: 'CreditCard',
      color: 'warning'
    }
  ];

  return (
    <div className="bg-surface rounded-lg shadow-card border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-text-primary">
          Vehicle Information
        </h2>
        {!isEditing ? (
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            onClick={() => setIsEditing(true)}
          >
            Edit Vehicle
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              iconName="Check"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Vehicle Image */}
        <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-24 rounded-lg overflow-hidden bg-surface-secondary border-2 border-border">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Vehicle"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="Car" size={32} className="text-text-muted" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors duration-fast">
                  <Icon name="Camera" size={16} className="text-primary-foreground" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs text-text-secondary text-center">
              Vehicle Photo
            </p>
          </div>

          {/* Vehicle Details */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Make
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="make"
                    value={formData.make}
                    onChange={handleInputChange}
                    placeholder="e.g., Toyota"
                  />
                ) : (
                  <p className="text-text-primary bg-surface-secondary rounded-lg px-3 py-2">
                    {vehicleInfo?.make || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Model
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g., Camry"
                  />
                ) : (
                  <p className="text-text-primary bg-surface-secondary rounded-lg px-3 py-2">
                    {vehicleInfo?.model || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Year
                </label>
                {isEditing ? (
                  <Input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2020"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                ) : (
                  <p className="text-text-primary bg-surface-secondary rounded-lg px-3 py-2">
                    {vehicleInfo?.year || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Color
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Silver"
                  />
                ) : (
                  <p className="text-text-primary bg-surface-secondary rounded-lg px-3 py-2">
                    {vehicleInfo?.color || 'Not provided'}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                License Plate
              </label>
              {isEditing ? (
                <Input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC-1234"
                />
              ) : (
                <p className="text-text-primary bg-surface-secondary rounded-lg px-3 py-2 font-data">
                  {vehicleInfo?.licensePlate || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Document Status */}
        <div className="border-t border-border-muted pt-6">
          <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
            Document Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documentStatus.map((doc, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-surface-secondary rounded-lg"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  doc.color === 'success' ? 'bg-success-100' : 'bg-warning-100'
                }`}>
                  <Icon 
                    name={doc.icon} 
                    size={20} 
                    className={doc.color === 'success' ? 'text-success-600' : 'text-warning-600'} 
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">
                    {doc.name}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      doc.color === 'success' ? 'bg-success' : 'bg-warning'
                    }`}></div>
                    <span className={`text-xs capitalize ${
                      doc.color === 'success' ? 'text-success-600' : 'text-warning-600'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleSection;