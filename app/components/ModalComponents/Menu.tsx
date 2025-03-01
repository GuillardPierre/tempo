import React from 'react';
import ButtonMenu from '../ButtonMenu';

export default function Menu() {
  return (
    <>
      <ButtonMenu type='square' text='Profil' action={() => {}} />
      <ButtonMenu type='square' text='Paramètres' action={() => {}} />
      <ButtonMenu type='square' text='Aide' action={() => {}} />
    </>
  );
}
