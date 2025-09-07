import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColors } from "../hooks/useThemeColors";
import Header from "../components/Header";
import { useState } from "react";
import ModalMenu from "../components/Modal";
import Menu from "../components/ModalComponents/Menu";
import useSnackBar from "../hooks/useSnackBar";
import CustomSnackBar from "../components/utils/CustomSnackBar";
import { List } from "react-native-paper";
import FAQResponse from "../components/FAQResponse";
import ThemedText from "../components/utils/ThemedText";

export default function Tutorial() {
  const colors = useThemeColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<
    "menu" | "update" | "delete" | "exception"
  >("menu");
  const { color, open, message, setOpen, setSnackBar } = useSnackBar();

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.primary, flex: 1 }}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <Header
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setModalType={setModalType}
        />

        <ThemedText
          variant="header1"
          color="primaryText"
          style={{ textAlign: "center" }}
        >
          FAQ
        </ThemedText>
        <List.Accordion
          style={{ backgroundColor: colors.primary }}
          title="Quel est le but de l'application ?"
          id="0"
        >
          <FAQResponse
            text={`Le but de l'application est de vous aider à gérer votre temps de travail plus facilement.
Vous pourrez enregistrer vos tâches récurrentes ou non très facilement.

Grâce à Tempo, vous pourrez observer facilement le temps que vous consacrez à votre travail sur différentes périodes grâce à différents schémas statistiques.`}
          />
        </List.Accordion>
        <List.AccordionGroup>
          <List.Accordion
            style={{ backgroundColor: colors.primary }}
            title="Comment créer une catégorie ?"
            id="1"
          >
            <FAQResponse
              text={`1- Appuyer sur le bouton + dans la partie inférieure droit de l'écran 
2-  Choisir le type d'événement que vous souhaitez créer (chrono ou  activité)
3- Dans ces formulaires vous aurez la possibilité de choisir ou de créer une catégorie`}
            />
          </List.Accordion>
          <List.Accordion
            style={{ backgroundColor: colors.primary }}
            title="Comment créer une activité ponctuelle ?"
            id="2"
          >
            <FAQResponse
              text={`1. Appuyez sur le bouton + dans la partie inférieure droite de l'écran
2. Choisissez "Activité"
3. Vous aurez la possibilité de choisir ou de créer une catégorie
4. Choisissez une date, une heure de début et une heure de fin
5. Enregistrez l'activité

Une activité ponctuelle permet d'enregistrer une activité avec une durée déterminée à un moment précis.`}
            />
          </List.Accordion>
          <List.Accordion
            style={{ backgroundColor: colors.primary }}
            title="Comment créer une activité récurrente ?"
            id="3"
          >
            <FAQResponse
              text={`1. Suivez les mêmes étapes que pour une activité ponctuelle
2. Appuyez sur le bouton "Répétition sur plusieurs jours"
3. Choisissez les jours de la semaine où l'activité sera répétée
4. Vous pouvez ajouter une date de fin (optionnel)
5. Enregistrez l'activité

Une activité récurrente permet d'enregistrer une activité avec une durée déterminée qui se répète selon un planning défini.`}
            />
          </List.Accordion>
          <List.Accordion
            style={{ backgroundColor: colors.primary }}
            title="Comment créer un chrono ?"
            id="4"
          >
            <FAQResponse
              text={`1. Appuyez sur le bouton + dans la partie inférieure droite de l'écran
2. Choisissez "Chrono"
3. Vous aurez la possibilité de choisir ou de créer une catégorie
4. Choisissez une date et une heure de début
5. Enregistrez le chrono
6. Une fois le chrono terminé, vous pourrez le stopper et enregistrer le temps de travail

Un chrono permet d'enregistrer un temps de travail avec un chronomètre en temps réel. Le temps sera automatiquement calculé et enregistré comme une activité ponctuelle.`}
            />
          </List.Accordion>
          <List.Accordion
            style={{ backgroundColor: colors.primary }}
            title="Comment modifier ou supprimer une catégorie ?"
            id="5"
          >
            <FAQResponse
              text={`1. Appuyez sur le bouton en haut à droite de l'écran pour ouvrir le menu
2. Choisissez "mes catégories"
3. Modifiez ou supprimez la catégorie souhaitée (si des activités sont associées à la catégorie, elles seront également supprimées)`}
            />
          </List.Accordion>
          <List.Accordion
            style={{ backgroundColor: colors.primary }}
            title="Comment créer une période de vacances / de pause / d'arrêt ?"
            id="6"
          >
            <FAQResponse
              text={`Si vous souhaitez créer une période de vacances / de pause / d'arrêt, pour que les activités récurrentes ne soient pas comptées pendant cette période, vous pouvez créer une période de vacances / de pause / d'arrêt.

1. Appuyez sur le bouton + dans la partie inférieure droite de l'écran
2. Choisissez "Pause"
3. Choisissez une date de début et une date de fin
4. Enregistrez la pause`}
            />
          </List.Accordion>
        </List.AccordionGroup>

        <CustomSnackBar
          color={color}
          message={message}
          open={open}
          setOpen={setOpen}
        />
      </SafeAreaView>
      <ModalMenu modalVisible={modalVisible} setModalVisible={setModalVisible}>
        {modalType === "menu" && <Menu setModalVisible={setModalVisible} />}
      </ModalMenu>
    </>
  );
}

const styles = StyleSheet.create({});
