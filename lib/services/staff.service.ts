import { getArrFromObj } from "@ashirbad/js-core";
import {
  changePassword,
  createUser,
  deleteUser,
  mutate,
} from "@atechhub/firebase";
import type { User, UserInput, UserUpdateInput } from "@/lib/types/user.type";

class StaffService {
  /**
   * Create a new staff (includes Firebase Auth user creation)
   */
  async create(data: UserInput): Promise<{
    userId: string;
    authResponse: Awaited<ReturnType<typeof createUser>>;
  }> {
    // Step 1: Create Firebase Auth user
    const authResponse = await createUser(data.email, data.password);

    // Step 2: Create staff record in users database
    const userId = await mutate({
      action: "createWithId",
      path: `users/${authResponse.localId}`,
      data: {
        uid: authResponse.localId,
        name: data.name,
        email: data.email,
        password: data.password,
        role: "staff",
        status: "active",
      },
      actionBy: "admin",
    });

    return { userId, authResponse };
  }

  /**
   * Get all staffs
   */
  async getAll(): Promise<User[]> {
    const data = await mutate({
      action: "get",
      path: "users",
    });
    const allUsers = getArrFromObj(data || {}) as unknown as User[];
    return allUsers.filter((user) => user.role === "staff");
  }

  /**
   * Get a staff by ID
   */
  async getById(id: string): Promise<User | null> {
    const data = await mutate({
      action: "get",
      path: `users/${id}`,
    });
    const staff = data as unknown as User;
    return staff && staff.role === "staff" ? staff : null;
  }

  /**
   * Update a staff
   */
  async update(id: string, data: UserUpdateInput): Promise<void> {
    await mutate({
      action: "update",
      path: `users/${id}`,
      data: {
        ...data,
      },
      actionBy: "admin",
    });
  }

  /**
   * Delete a staff (includes Firebase Auth user deletion)
   */
  async delete(
    id: string,
    email: string,
    currentPassword: string
  ): Promise<void> {
    // Step 1: Delete Firebase Auth user
    await deleteUser(email, currentPassword);

    // Step 2: Delete database record
    await mutate({
      action: "delete",
      path: `users/${id}`,
      actionBy: "admin",
    });
  }

  /**
   * Get staff by email
   */
  async getByEmail(email: string): Promise<User | null> {
    const staffs = await this.getAll();
    return staffs.find((staff) => staff.email === email) || null;
  }

  /**
   * Get staff by Firebase UID
   */
  async getByFirebaseUid(uid: string): Promise<User | null> {
    const staffs = await this.getAll();
    return staffs.find((staff) => staff.uid === uid) || null;
  }

  /**
   * Change staff password
   */
  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const staff = await this.getById(id);
    if (!staff) {
      throw new Error("Staff not found");
    }

    await changePassword(staff.email, currentPassword, newPassword);
  }
}

export const staffService = new StaffService();
