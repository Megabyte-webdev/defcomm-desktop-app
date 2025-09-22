import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "../services/axios-client";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { onFailure } from "../utils/notifications/OnFailure";
import { onSuccess } from "../utils/notifications/OnSuccess";
import { extractErrorMessage } from "../utils/formmaters";

const useDrive = () => {
  const { authDetails } = useContext(AuthContext);
  const token = authDetails?.access_token;
  const client = axiosClient(token);
  const queryClient = useQueryClient();

  // ✅ Fetch Folders
  const getFoldersQuery = useQuery({
    queryKey: ["folders"],
    queryFn: async () => {
      const { data } = await client.get("/user/folder");
      return data?.data || [];
    },
    enabled: !!authDetails,
    refetchOnMount: true,
    staleTime: 0,
  });
  const getFolderByIdQuery = (id) => {
    return useQuery({
      queryKey: ["folder", id],
      queryFn: async () => {
        const { data } = await client.get(`/user/folder/${id}`);
        return data?.data || [];
      },
      enabled: !!authDetails && !!id,
      staleTime: 0,
      refetchOnMount: true,
    });
  };

  // ✅ Create Folder Mutation
  const createFolderMutation = useMutation({
    mutationFn: (payload) => client.post("/user/folder/create", payload),
    onSuccess: (_, variables) => {
      if (variables?.rel === "") {
        queryClient.invalidateQueries(["folders"]);
      } else {
        queryClient.invalidateQueries(["folder", variables?.rel]);
      }
      onSuccess({
        message: "Folder successfully created!",
        success: "New folder added",
      });
    },
    onError: (err) => {
      onFailure({
        message: "Failed to create folder",
        error: extractErrorMessage(err),
      });
    },
  });
  const updateFolderMutation = useMutation({
    mutationFn: (payload) => client.post("/user/folderUpdate", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
      onSuccess({
        message: "Folder successfully updated!",
        success: "Folder updated",
      });
    },
    onError: (err) => {
      onFailure({
        message: "Failed to update folder",
        error: extractErrorMessage(err),
      });
    },
  });

  const deleteFolderMutation = useMutation({
    mutationFn: (id) => client.get(`/user/folderDel/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["folders"]);
      onSuccess({
        message: "Folder successfully deleted!",
        success: "Folder deleted",
      });
    },
    onError: (err) => {
      onFailure({
        message: "Failed to delete folder",
        error: extractErrorMessage(err),
      });
    },
  });

  return {
    getFoldersQuery,
    getFolderByIdQuery,
    createFolderMutation,
    updateFolderMutation,
    deleteFolderMutation,
  };
};

export default useDrive;
