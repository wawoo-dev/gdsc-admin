// api/events.ts

import { apiClient } from ".";
import {
  EventParticipantsResponse,
  EventResponse,
  SearchMemberListResponse,
} from "@/types/dtos/event";

export const eventApi = {
  getEventList: async (page: number = 1, size: number = 20): Promise<EventResponse> => {
    const response = await apiClient.get<EventResponse>(`/admin/events?page=${page}&size=${size}`);
    return response.data;
  },
  getParticipants: async (
    eventId: number,
    page: number = 0,
    size: number = 20,
    sort: string = "",
  ): Promise<EventParticipantsResponse> => {
    const res = await apiClient.get<EventParticipantsResponse>(
      `/admin/event-participations/applicants`,
      { params: { event: eventId, page, size, sort } },
    );
    return res.data;
  },
  getSearchMemberList: async (
    eventId: number,
    name: string,
  ): Promise<SearchMemberListResponse[]> => {
    const response = await apiClient.get<SearchMemberListResponse[]>(
      `/admin/event-participations/members/participable/search`,
      { params: { event: eventId, name } },
    );
    return response.data;
  },
  postParticipants: async (eventId: number, memberId: number) => {
    const response = await apiClient.post(`/admin/event-participations/apply/manual/registered`, {
      eventId: eventId,
      memberId: memberId,
    });
    return response.data;
  },
};
