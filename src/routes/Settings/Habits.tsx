// import { useState } from "react";

// import { ButtonWithPopover } from "../../components/ButtonWithPopover";
import { SettingsOption } from "../../components/SettingsOption";

import { usePreferences } from "../../hooks/usePreferences";

export const Habits = () => {
  const [preferences] = usePreferences();

  return (
    <SettingsOption
      options={[
        {
          id: "true",
          title: "Enabled",
          isSelected: preferences.enableHabits,
        },
        {
          id: "false",
          title: "Disabled",
          isSelected: !preferences.enableHabits,
        },
      ]}
      setting="enableHabits"
      title="Habit Tracking"
    />
  );
};

//   const userId = "current-user-id"; // Replace with actual user ID logic
//   const [habits, { createHabit, updateHabit, deleteHabit }] = useHabits();

//   const [newHabit, setNewHabit] = useState({
//     title: "",
//     emoji: "",
//     days_active: [],
//     steps: 1,
//   });

//   const handleCreate = () => {
//     createHabit({ ...newHabit, user_id: userId as string });
//     setNewHabit({ title: "", emoji: "", days_active: [], steps: 1 });
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Manage Habits</h2>

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Habit Title"
//           value={newHabit.title}
//           onChange={(e) => setNewHabit({ ...newHabit, title: e.target.value })}
//           className="input input-bordered w-full mb-2"
//         />

//         <ButtonWithPopover
//           variant="emoji"
//           popoverId="emoji-picker"
//           buttonVariant="round"
//           onChange={(emoji) => setNewHabit({ ...newHabit, emoji })}
//         >
//           {newHabit.emoji || "😀"}
//         </ButtonWithPopover>

//         <ButtonWithPopover
//           variant="menu"
//           popoverId="days-picker"
//           buttonVariant="round"
//           options={[
//             {
//               id: 1,
//               title: "Monday",
//               isSelected: newHabit.days_active.includes(1),
//             },
//             {
//               id: 2,
//               title: "Tuesday",
//               isSelected: newHabit.days_active.includes(2),
//             },
//             {
//               id: 3,
//               title: "Wednesday",
//               isSelected: newHabit.days_active.includes(3),
//             },
//             {
//               id: 4,
//               title: "Thursday",
//               isSelected: newHabit.days_active.includes(4),
//             },
//             {
//               id: 5,
//               title: "Friday",
//               isSelected: newHabit.days_active.includes(5),
//             },
//             {
//               id: 6,
//               title: "Saturday",
//               isSelected: newHabit.days_active.includes(6),
//             },
//             {
//               id: 7,
//               title: "Sunday",
//               isSelected: newHabit.days_active.includes(7),
//             },
//           ]}
//           onChange={(day) =>
//             setNewHabit((prev) => ({
//               ...prev,
//               days_active: prev.days_active.includes(day)
//                 ? prev.days_active.filter((d) => d !== day)
//                 : [...prev.days_active, day],
//             }))
//           }
//         >
//           {newHabit.days_active.length} Days Active
//         </ButtonWithPopover>

//         <input
//           type="number"
//           placeholder="Steps"
//           value={newHabit.steps}
//           onChange={(e) =>
//             setNewHabit({ ...newHabit, steps: Number(e.target.value) })
//           }
//           className="input input-bordered w-full mb-2"
//         />

//         <button className="btn btn-primary w-full" onClick={handleCreate}>
//           Add Habit
//         </button>
//       </div>

//       <ul>
//         {habitsQueryData?.map((habit) => (
//           <li key={habit.id} className="mb-2">
//             <div className="flex items-center gap-2">
//               <span>{habit.emoji}</span>
//               <span>{habit.title}</span>
//               <button
//                 className="btn btn-sm btn-warning"
//                 onClick={() =>
//                   updateHabit({
//                     id: habit.id,
//                     updates: { is_paused: !habit.is_paused },
//                   })
//                 }
//               >
//                 {habit.is_paused ? "Resume" : "Pause"}
//               </button>
//               <button
//                 className="btn btn-sm btn-error"
//                 onClick={() => deleteHabit(habit.id)}
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
