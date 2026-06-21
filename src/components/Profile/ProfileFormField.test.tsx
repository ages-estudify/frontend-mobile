import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";
import { ProfileFormField } from "./ProfileFormField";

describe("ProfileFormField", () => {
  it("renderiza label e valor em modo input", () => {
    render(
      <ProfileFormField
        label="Nome"
        value="Ana Silva"
        onChangeText={jest.fn()}
        testID="name-input"
      />
    );

    expect(screen.getByText("Nome")).toBeTruthy();
    expect(screen.getByDisplayValue("Ana Silva")).toBeTruthy();
  });

  it("chama onChangeText ao editar o campo", () => {
    const onChangeText = jest.fn();

    render(
      <ProfileFormField
        label="Curso Desejado"
        value=""
        onChangeText={onChangeText}
        testID="course-input"
      />
    );

    fireEvent.changeText(screen.getByTestId("course-input"), "Medicina");
    expect(onChangeText).toHaveBeenCalledWith("Medicina");
  });

  it("renderiza valor como texto quando variant é text", () => {
    render(<ProfileFormField label="Situação do Plano" value="Ativo" variant="text" />);

    expect(screen.getByText("Situação do Plano")).toBeTruthy();
    expect(screen.getByText("Ativo")).toBeTruthy();
    expect(screen.queryByDisplayValue("Ativo")).toBeNull();
  });

  it("desabilita edição quando editable é false", () => {
    render(
      <ProfileFormField label="E-mail" value="ana@test.com" editable={false} testID="email-input" />
    );

    expect(screen.getByTestId("email-input").props.editable).toBe(false);
  });

  it("renderiza placeholder quando informado", () => {
    render(
      <ProfileFormField
        label="Nome"
        value=""
        placeholder="Digite seu nome"
        onChangeText={jest.fn()}
        testID="name-input"
      />
    );

    expect(screen.getByPlaceholderText("Digite seu nome")).toBeTruthy();
  });
});
