import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNfiTripsById } from 'Services/trips';
import { generateTripsFormData } from 'Utilities/trips';

import TripsRegistration from '.';

const EditTrips = () => {
  const [formData, setFormData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getNfiTripsById(id).then((res) => {
        const tripsData = generateTripsFormData(res);
        setFormData(tripsData);
      });
    }
  }, [id]);

  if (!Object.keys(formData).length) return null;

  return (
    <TripsRegistration
      initialFormData={formData}
      shipmentIds={formData.shipmentIds}
      tripId={id}
      header={`Edit Trip - ${formData.originalData.identifier}`}
    />
  );
};

export default EditTrips;
