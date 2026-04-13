/* global jest */
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";
import "@testing-library/jest-native/extend-expect";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);
