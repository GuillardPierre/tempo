import { Vibration, View } from 'react-native';
import React from 'react';
import CustomAutocomplete from '../components/CustomAutoComplete';
import ButtonMenu from '../components/ButtonMenu';
import TimePickerInput from './utils/TimePickerInput';
import { useState } from 'react';
import RoundButton from '../components/utils/RoundButton';

export default function TimerForm() {
  const [endIsDefine, setEndIsDefine] = useState(false);

  return (
    <View>
      <CustomAutocomplete label='Choisissez une activité :' />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 10,
        }}
      >
        <View style={{ width: '40%' }}>
          <TimePickerInput
            label='heure de début:'
            value={new Date()}
            onChange={() => {}}
          />
        </View>
        <View style={{ width: '40%' }}>
          {endIsDefine ? (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 20,
              }}
            >
              <View style={{ width: '100%' }}>
                <TimePickerInput
                  label='heure de fin:'
                  value={new Date()}
                  onChange={() => {}}
                />
              </View>
              <View style={{ width: '30%' }}>
                <RoundButton
                  svgSize={18}
                  btnSize={30}
                  variant='primary'
                  type='close'
                  onPress={() => {
                    Vibration.vibrate(50);
                    setEndIsDefine(!endIsDefine);
                  }}
                ></RoundButton>
              </View>
            </View>
          ) : (
            <ButtonMenu
              type='round'
              text='+ FIN'
              action={() => {
                Vibration.vibrate(50);
                setEndIsDefine(!endIsDefine);
              }}
            />
          )}
        </View>
      </View>
      <View style={{ marginTop: 10, height: 80, alignItems: 'center' }}>
        <ButtonMenu
          type='round'
          text={endIsDefine ? "Enregistrer l'activité" : 'Lancer Chronomètre'}
          action={() => {}}
        />
      </View>
    </View>
  );
}
