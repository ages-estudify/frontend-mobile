import { emptyUserStatsMock } from "../mocks/userStatsMock";
import { UserStatsData } from "../types/userStats";
import { api } from "./api";

export const usersStatsService = {
  getUserStats: async (): Promise<UserStatsData> => {
    // quando a tarefa BACK-06.5 estiver na develop

    // const response = await api.get('/users/stats');
    // return response.data.data;

    // mocado temporário populado para testar
    return Promise.resolve(emptyUserStatsMock.data);
  },
};

/*populado visual*/

// import { populatedUserStatsMock } from "../mocks/userStatsMock";
// import { UserStatsData } from "../types/userStats";

// export const usersStatsService = {
//   getUserStats: async (): Promise<UserStatsData> => {
//     return Promise.resolve(populatedUserStatsMock.data);
//   },
// };
